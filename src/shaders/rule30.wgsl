// SPDX-License-Identifier: Apache-2.0
//
// Rule 30, 1D and 2D: one layer per dispatch.
//
// The references are evolveRule30() and evolveRule30_2D() in src/matrixFunctions.js. Each of
// their generations keeps every layer it has and adds one new layer (y) below the lowest one,
// computed from that lowest layer alone. So the GPU only steps that layer: `current` is the
// lowest layer, `next` the one below it. src/gpu/engine.js puts each new layer into the grid,
// where the CPU would. A layer of size × size cells is packed four to a u32 word, cell x + z*size;
// each invocation writes one whole word.

struct Params {
  size: u32,       // grid edge length
  cellCount: u32,  // cells in a layer: size²
  wordCount: u32,  // ceil(cellCount / 4)
  wrap: u32,       // 1: the edges wrap around; 0: neighbours clamp to the grid, as on the CPU
  rowWords: u32,   // words per row of the dispatch (workgroups along x × 64)
  twoD: u32,       // 1: Rule 30 2D; 0: Rule 30 (1D)
  _pad0: u32,
  _pad1: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> current: array<u32>;
@group(0) @binding(2) var<storage, read_write> next: array<u32>;

fn cellAt(x: u32, z: u32) -> u32 {
  let i = x + z * params.size;
  return (current[i >> 2u] >> ((i & 3u) * 8u)) & 0xffu;
}

fn neighbour(c: u32, d: i32) -> u32 {
  let n = i32(params.size);
  let v = i32(c) + d;
  if (params.wrap == 1u) {
    return u32((v + n) % n);
  }
  return u32(clamp(v, 0, n - 1));
}

// Rule 30 on a row of three: 100, 011, 010 and 001 give 1, the rest 0
fn rule30(left: u32, centre: u32, right: u32) -> u32 {
  return left ^ (centre | right);
}

fn rowResult(x: u32, z: u32) -> u32 {
  return rule30(cellAt(neighbour(x, -1), z), cellAt(x, z), cellAt(neighbour(x, 1), z));
}

fn nextCell(i: u32) -> u32 {
  let x = i % params.size;
  let z = i / params.size;
  var v = rowResult(x, z);
  if (params.twoD == 1u) {
    // 2D: the rows either side (along z) flip the middle row's result by their parity
    v = v ^ rowResult(x, neighbour(z, -1)) ^ rowResult(x, neighbour(z, 1));
  }
  return v;
}

@compute @workgroup_size(64)
fn stepGeneration(@builtin(global_invocation_id) id: vec3<u32>) {
  let w = id.x + id.y * params.rowWords;
  if (w >= params.wordCount) {
    return;
  }
  var word = 0u;
  for (var k = 0u; k < 4u; k++) {
    let i = w * 4u + k;
    if (i < params.cellCount) {
      word |= nextCell(i) << (k * 8u);
    }
  }
  next[w] = word;
}
