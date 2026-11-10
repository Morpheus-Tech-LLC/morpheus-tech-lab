// SPDX-License-Identifier: Apache-2.0
//
// Game of Life 3D: one generation per dispatch.
//
// The reference is convolve3D() in src/matrixFunctions.js: this must give exactly its grids,
// cell for cell. Cells are bytes packed four to a u32 word (byte k of word w is cell 4w + k),
// the same layout as Grid3D.data, so a buffer copies straight into a Uint8Array. Cell i is at
// x + y*size + z*size². Each invocation writes one whole word, so no two write the same memory.

struct Params {
  size: u32,       // grid edge length
  cellCount: u32,  // size³
  wordCount: u32,  // ceil(cellCount / 4)
  wrap: u32,       // 1: the edges wrap around; 0: neighbours clamp to the grid, as on the CPU
  rowWords: u32,   // words per row of the dispatch (workgroups along x × 64)
  _pad0: u32,
  _pad1: u32,
  _pad2: u32,
  // Bit n set: n live neighbours give birth (or let a live cell survive).
  // Index 0 is the interior; with wrapping off, 1 is a face, 2 an edge and 3 a corner.
  birth: vec4<u32>,
  survival: vec4<u32>,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> current: array<u32>;
@group(0) @binding(2) var<storage, read_write> next: array<u32>;

fn cell(i: u32) -> u32 {
  return (current[i >> 2u] >> ((i & 3u) * 8u)) & 0xffu;
}

// A neighbour's coordinate along one axis. With wrapping off it clamps to the grid, so a cell
// on the boundary counts the cells beside it (and itself) more than once, as the CPU does.
fn neighbour(c: u32, d: i32) -> u32 {
  let n = i32(params.size);
  let v = i32(c) + d;
  if (params.wrap == 1u) {
    return u32((v + n) % n);
  }
  return u32(clamp(v, 0, n - 1));
}

fn onBoundary(c: u32) -> u32 {
  return select(0u, 1u, c == 0u || c == params.size - 1u);
}

fn nextCell(i: u32) -> u32 {
  let s = params.size;
  let x = i % s;
  let y = (i / s) % s;
  let z = i / (s * s);

  var count = 0u;
  for (var dz = -1; dz <= 1; dz++) {
    let nz = neighbour(z, dz);
    for (var dy = -1; dy <= 1; dy++) {
      let ny = neighbour(y, dy);
      for (var dx = -1; dx <= 1; dx++) {
        if (dx == 0 && dy == 0 && dz == 0) {
          continue;
        }
        count += cell(neighbour(x, dx) + ny * s + nz * s * s);
      }
    }
  }

  // Which rules apply: the boundary count picks face, edge or corner when wrapping is off
  var kind = 0u;
  if (params.wrap == 0u) {
    kind = onBoundary(x) + onBoundary(y) + onBoundary(z);
  }
  let bit = select(0u, 1u << count, count < 32u);

  if (cell(i) == 1u) {
    return select(0u, 1u, (params.survival[kind] & bit) != 0u);
  }
  // The CPU only looks at live cells and their neighbours, so a dead cell with no live
  // neighbour stays dead, even if a birth rule lists 0
  if (count == 0u) {
    return 0u;
  }
  return select(0u, 1u, (params.birth[kind] & bit) != 0u);
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
