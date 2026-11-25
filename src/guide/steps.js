// SPDX-License-Identifier: Apache-2.0
//
// The guide's words and its sources (#159), as data: what each step says, which animation
// plays with it (scenes.js), and the works it cites, so the people behind each finding get the
// credit. Every claim was checked against its source; a test checks that each cited key exists
// and that every source is cited. No DOM.

/**
 * @typedef {object} Source
 * @property {string} authors - as the work credits them
 * @property {number} [year] - none for a wiki page, which keeps changing
 * @property {string} title
 * @property {string} venue - where it appeared
 * @property {string} [url] - a DOI link where one exists
 * @property {string} short - how a step's sources line names it
 */

/** @type {Record<string, Source>} */
export const SOURCES = {
  vonNeumann1966: {
    authors: 'John von Neumann; edited and completed by Arthur W. Burks',
    year: 1966,
    title: 'Theory of Self-Reproducing Automata',
    venue: 'University of Illinois Press',
    url: 'https://archive.org/details/theoryofselfrepr00vonn_0',
    short: 'von Neumann 1966',
  },
  wolfram1983: {
    authors: 'Stephen Wolfram',
    year: 1983,
    title: 'Statistical mechanics of cellular automata',
    venue: 'Reviews of Modern Physics 55, 601–644',
    url: 'https://doi.org/10.1103/RevModPhys.55.601',
    short: 'Wolfram 1983',
  },
  wolfram1986: {
    authors: 'Stephen Wolfram',
    year: 1986,
    title: 'Random sequence generation by cellular automata',
    venue: 'Advances in Applied Mathematics 7, 123–169',
    url: 'https://doi.org/10.1016/0196-8858(86)90028-X',
    short: 'Wolfram 1986',
  },
  gardner1970: {
    authors: 'Martin Gardner',
    year: 1970,
    title: 'Mathematical Games: The fantastic combinations of John Conway’s new solitaire game “life”',
    venue: 'Scientific American 223 (4), 120–123',
    url: 'https://doi.org/10.1038/scientificamerican1070-120',
    short: 'Gardner 1970',
  },
  gardner1971: {
    authors: 'Martin Gardner',
    year: 1971,
    title: 'Mathematical Games: On cellular automata, self-reproduction, the Garden of Eden and the game “life”',
    venue: 'Scientific American 224 (2), 112–117',
    url: 'https://doi.org/10.1038/scientificamerican0271-112',
    short: 'Gardner 1971',
  },
  rPentomino: {
    authors: 'LifeWiki contributors',
    title: 'R-pentomino',
    venue: 'LifeWiki, the wiki of the Game of Life community',
    url: 'https://conwaylife.com/wiki/R-pentomino',
    short: 'LifeWiki: R-pentomino',
  },
  gosperGun: {
    authors: 'Bill Gosper and his group at MIT',
    year: 1970,
    title: 'Gosper glider gun',
    venue: 'Described on LifeWiki, the wiki of the Game of Life community',
    url: 'https://conwaylife.com/wiki/Gosper_glider_gun',
    short: 'LifeWiki: Gosper glider gun',
  },
  winningWays1982: {
    authors: 'Elwyn R. Berlekamp, John H. Conway and Richard K. Guy',
    year: 1982,
    title: 'Winning Ways for Your Mathematical Plays, volume 2, chapter 25: What is Life?',
    venue: 'Academic Press',
    short: 'Berlekamp, Conway, Guy 1982',
  },
  rendell2002: {
    authors: 'Paul Rendell',
    year: 2002,
    title: 'Turing Universality of the Game of Life',
    venue: 'Collision-Based Computing (ed. Andrew Adamatzky), Springer, 513–539',
    url: 'https://doi.org/10.1007/978-1-4471-0129-1_18',
    short: 'Rendell 2002',
  },
  bays1987: {
    authors: 'Carter Bays',
    year: 1987,
    title: 'Candidates for the Game of Life in Three Dimensions',
    venue: 'Complex Systems 1 (3), 373–400',
    url: 'https://www.complex-systems.com/abstracts/v01_i03_a01/',
    short: 'Bays 1987',
  },
  speedOfLight: {
    authors: 'LifeWiki contributors',
    title: 'Speed of light',
    venue: 'LifeWiki, the wiki of the Game of Life community',
    url: 'https://conwaylife.com/wiki/Speed_of_light',
    short: 'LifeWiki: Speed of light',
  },
  manukyan2017: {
    authors: 'Liana Manukyan, Sophie A. Montandon, Anamarija Fofonjka, Stanislav Smirnov and Michel C. Milinkovitch',
    year: 2017,
    title: 'A living mesoscopic cellular automaton made of skin scales',
    venue: 'Nature 544, 173–179',
    url: 'https://doi.org/10.1038/nature22031',
    short: 'Manukyan et al. 2017',
  },
  hpp1973: {
    authors: 'J. Hardy, Y. Pomeau and O. de Pazzis',
    year: 1973,
    title: 'Time evolution of a two-dimensional model system. I. Invariant states and time correlation functions',
    venue: 'Journal of Mathematical Physics 14, 1746–1759',
    url: 'https://doi.org/10.1063/1.1666248',
    short: 'Hardy, Pomeau, de Pazzis 1973',
  },
  fhp1986: {
    authors: 'U. Frisch, B. Hasslacher and Y. Pomeau',
    year: 1986,
    title: 'Lattice-Gas Automata for the Navier-Stokes Equation',
    venue: 'Physical Review Letters 56, 1505–1508',
    url: 'https://doi.org/10.1103/PhysRevLett.56.1505',
    short: 'Frisch, Hasslacher, Pomeau 1986',
  },
  mcnamara1988: {
    authors: 'Guy R. McNamara and Gianluigi Zanetti',
    year: 1988,
    title: 'Use of the Boltzmann Equation to Simulate Lattice-Gas Automata',
    venue: 'Physical Review Letters 61, 2332–2335',
    url: 'https://doi.org/10.1103/PhysRevLett.61.2332',
    short: 'McNamara, Zanetti 1988',
  },
  nagel1992: {
    authors: 'Kai Nagel and Michael Schreckenberg',
    year: 1992,
    title: 'A cellular automaton model for freeway traffic',
    venue: 'Journal de Physique I 2, 2221–2229',
    url: 'https://doi.org/10.1051/jp1:1992277',
    short: 'Nagel, Schreckenberg 1992',
  },
  btw1987: {
    authors: 'Per Bak, Chao Tang and Kurt Wiesenfeld',
    year: 1987,
    title: 'Self-organized criticality: An explanation of the 1/f noise',
    venue: 'Physical Review Letters 59, 381–384',
    url: 'https://doi.org/10.1103/PhysRevLett.59.381',
    short: 'Bak, Tang, Wiesenfeld 1987',
  },
  dhar1990: {
    authors: 'Deepak Dhar',
    year: 1990,
    title: 'Self-organized critical state of sandpile automaton models',
    venue: 'Physical Review Letters 64, 1613–1616',
    url: 'https://doi.org/10.1103/PhysRevLett.64.1613',
    short: 'Dhar 1990',
  },
  cook2004: {
    authors: 'Matthew Cook',
    year: 2004,
    title: 'Universality in Elementary Cellular Automata',
    venue: 'Complex Systems 15 (1), 1–40',
    url: 'https://doi.org/10.25088/ComplexSystems.15.1.1',
    short: 'Cook 2004',
  },
  brown2023: {
    authors: 'Nico Brown, Carson Cheng, Tanner Jacobi, Maia Karpovich, Matthias Merzenich, David Raucci and Mitchell Riley',
    year: 2023,
    title: 'Conway’s Game of Life is Omniperiodic',
    venue: 'arXiv:2312.02799',
    url: 'https://arxiv.org/abs/2312.02799',
    short: 'Brown et al. 2023',
  },
  gemini: {
    authors: 'Andrew J. Wade',
    year: 2010,
    title: 'Gemini, the first self-constructing spaceship in Life',
    venue: 'Described on LifeWiki, the wiki of the Game of Life community',
    url: 'https://conwaylife.com/wiki/Gemini',
    short: 'LifeWiki: Gemini',
  },
  sirRobin: {
    authors: 'Adam P. Goucher, from a partial result by Tomas Rokicki',
    year: 2018,
    title: 'Sir Robin, the first elementary knightship',
    venue: 'Described on LifeWiki, the wiki of the Game of Life community',
    url: 'https://conwaylife.com/wiki/Sir_Robin',
    short: 'LifeWiki: Sir Robin',
  },
  mordvintsev2020: {
    authors: 'Alexander Mordvintsev, Ettore Randazzo, Eyvind Niklasson and Michael Levin',
    year: 2020,
    title: 'Growing Neural Cellular Automata',
    venue: 'Distill 5 (2), e23',
    url: 'https://doi.org/10.23915/distill.00023',
    short: 'Mordvintsev et al. 2020',
  },
  rappaz1993: {
    authors: 'M. Rappaz and Ch.-A. Gandin',
    year: 1993,
    title: 'Probabilistic modelling of microstructure formation in solidification processes',
    venue: 'Acta Metallurgica et Materialia 41, 345–360',
    url: 'https://doi.org/10.1016/0956-7151(93)90065-Z',
    short: 'Rappaz, Gandin 1993',
  },
  gandin1997: {
    authors: 'Ch.-A. Gandin and M. Rappaz',
    year: 1997,
    title: 'A 3D Cellular Automaton algorithm for the prediction of dendritic grain growth',
    venue: 'Acta Materialia 45, 2187–2195',
    url: 'https://doi.org/10.1016/S1359-6454(96)00303-5',
    short: 'Gandin, Rappaz 1997',
  },
  gravner2009: {
    authors: 'Janko Gravner and David Griffeath',
    year: 2009,
    title: 'Modeling snow-crystal growth: A three-dimensional mesoscopic approach',
    venue: 'Physical Review E 79, 011601',
    url: 'https://doi.org/10.1103/PhysRevE.79.011601',
    short: 'Gravner, Griffeath 2009',
  },
  anderson2005: {
    authors: 'Alexander R. A. Anderson',
    year: 2005,
    title: 'A hybrid mathematical model of solid tumour invasion: the importance of cell adhesion',
    venue: 'Mathematical Medicine and Biology 22, 163–186',
    url: 'https://doi.org/10.1093/imammb/dqi005',
    short: 'Anderson 2005',
  },
  chan2019: {
    authors: 'Bert Wang-Chak Chan',
    year: 2019,
    title: 'Lenia: Biology of Artificial Life',
    venue: 'Complex Systems 28 (3), 251–286',
    url: 'https://doi.org/10.25088/ComplexSystems.28.3.251',
    short: 'Chan 2019',
  },
};

/**
 * @typedef {object} Step
 * @property {string} id
 * @property {string} title
 * @property {string[]} body - paragraphs
 * @property {string} scene - the animation, a key of scenes.js's SCENES
 * @property {string} alt - what the animation shows, for a screen reader
 * @property {string[]} sources - keys of SOURCES
 * @property {boolean} [finale] - the last step, with its ways into the lab
 */

/** @type {Step[]} */
export const STEPS = [
  {
    id: 'what',
    title: 'What is a cellular automaton?',
    body: [
      'A cellular automaton is a grid of cells, each alive or dead. Time moves in steps called generations. At each step, every cell looks at its neighbours and follows the same simple rule to choose its next state, all cells at once.',
      'No cell sees the whole grid, yet together they can grow, move and organise. John von Neumann and Stanisław Ulam devised the idea in the 1940s.',
    ],
    scene: 'intro',
    alt: 'A grid of cells changing generation by generation, with one cell and its eight neighbours outlined.',
    sources: ['vonNeumann1966'],
  },
  {
    id: 'rule30',
    title: 'One dimension: Rule 30',
    body: [
      'The simplest automata are a single row of cells. Each cell’s next state depends on itself and its two neighbours: eight possible patterns, so 256 possible rules, which Stephen Wolfram numbered in 1983.',
      'Rule 30 starts from one live cell and grows a pattern so irregular that it has been used to generate random numbers. The strip at the top is the whole rule; each row below is the next generation.',
    ],
    scene: 'rule30',
    alt: 'Rule 30’s eight cases, and below them a triangle of irregular cells growing row by row from a single cell.',
    sources: ['wolfram1983', 'wolfram1986'],
  },
  {
    id: 'life',
    title: 'Conway’s Game of Life',
    body: [
      'In 1970 the mathematician John Horton Conway designed a two-dimensional automaton, made famous that October by Martin Gardner’s column in Scientific American.',
      'Each cell has eight neighbours. A live cell with two or three live neighbours survives. A dead cell with exactly three is born. Every other cell dies or stays empty. In short, the rule is B3/S23: born with 3, survives with 2 or 3.',
    ],
    scene: 'rules',
    alt: 'One cell and its eight neighbours, playing out survival, birth, death by loneliness and death by overcrowding.',
    sources: ['gardner1970'],
  },
  {
    id: 'zoo',
    title: 'What lives in Life',
    body: [
      'Those three rules produce a whole zoo. Still lifes, like the block, never change. Oscillators repeat: the blinker every two generations. Spaceships travel: the glider moves one cell diagonally every four generations.',
      'Methuselahs are small seeds that run a long time before settling. The five-cell R-pentomino takes 1,103 generations, ending as 116 cells, six of them gliders flying away for ever.',
    ],
    scene: 'zoo',
    alt: 'A block, a blinker and a glider, beside the R-pentomino running to generation 1,103.',
    sources: ['gardner1970', 'rPentomino'],
  },
  {
    id: 'gun',
    title: 'Simple rules, unlimited complexity',
    body: [
      'Conway offered a $50 prize for a pattern that grows for ever. Later in 1970, Bill Gosper’s group at MIT won it with the glider gun, which fires a new glider every 30 generations.',
      'Gliders can carry signals, and with streams of them Life can compute anything a computer can: it is Turing complete.',
    ],
    scene: 'gun',
    alt: 'Gosper’s glider gun firing a stream of gliders.',
    sources: ['gardner1970', 'gardner1971', 'gosperGun', 'winningWays1982', 'rendell2002'],
  },
  {
    id: 'three',
    title: 'Add a dimension',
    body: [
      'On a cubic grid each cell has 26 neighbours instead of 8, so a rule has far more to choose from. Counting every way to choose the neighbour counts for birth and for survival, the flat grid allows 262,144 rules; the cubic grid allows about 18 quadrillion. Carter Bays began exploring them in 1987.',
      'The lab writes them in the same shorthand as Conway’s B3/S23: B lists the neighbour counts that bring a cell to life, S the counts that keep it alive, now from 0 to 26. The lab’s default, B9,10/S5–15, brings a cell to life with 9 or 10 live neighbours and keeps it alive with 5 to 15.',
    ],
    scene: 'neighbourhood3d',
    alt: 'A flat 3 by 3 neighbourhood tilts into 3D and gains a layer above and below: 8 neighbours become 26. Then the lab’s default rule, B9,10/S5–15, at work in a 3 by 3 by 3 neighbourhood: live neighbours are counted, and the cell survives with 8, is born with 9, and dies with 4 or with 17.',
    sources: ['bays1987'],
  },
  {
    id: 'lab',
    title: 'In this lab',
    body: [
      'The lab opens on B9,10/S5–15 in Game of Life 3D (unbounded), which has no edges: the world grows wherever life goes. Under some rules a 3D ship travels at c, one cell per generation, twice the top speed of any spaceship in Conway’s Life.',
      'Game of Life 3D (bounded) runs the same rule inside a box. At its walls a cell has fewer neighbours (17 on a face, 11 on an edge, 7 at a corner), so each has its own rules.',
    ],
    scene: 'lab3d',
    alt: 'The lab’s 10 by 10 by 10 cube swelling under its default rules, then an 8-cell ship flying one cell per generation, both run by the lab’s own engine. Beside each, a flat grid shows the cross-section through its middle layer, marked by a plane in the 3D view.',
    sources: ['speedOfLight'],
  },
  {
    id: 'findings',
    title: 'What automata have shown us',
    body: [
      'Cellular automata are a way to understand the world. The scales of the ocellated lizard turn green or black by rules a cellular automaton describes. Automata of colliding particles reproduce the equations of flowing fluids, and their descendant, the lattice Boltzmann method, is a standard way to simulate flow today.',
      'An automaton of cars on one lane explains traffic jams that appear from nowhere. And grain by grain, the sandpile showed how avalanches of every size arise with nothing tuning them.',
    ],
    scene: 'findings',
    alt: 'Four automata side by side: scales on a hexagonal grid switching colour, a gas of particles spreading in a box, traffic jams drifting backward, and a sandpile growing.',
    sources: ['manukyan2017', 'hpp1973', 'fhp1986', 'mcnamara1988', 'nagel1992', 'btw1987', 'dhar1990'],
  },
  {
    id: 'compute',
    title: 'Rules that compute, build and heal',
    body: [
      'Some automata can compute anything a computer can: Rule 110, a single row of cells, is among the simplest systems known to, as Matthew Cook proved. In 2023, seven researchers proved that Life has oscillators of every period, ending a search of decades. And Life keeps yielding new ships: Gemini (2010) moves by building a copy of itself, and Sir Robin (2018) travels like a chess knight.',
      'In the 1940s John von Neumann designed a self-reproducing automaton whose instructions are copied separately from the machine that reads them, the division of labour living cells were later found to use with DNA. Today, neural cellular automata learn rules that grow a shape from one cell and repair it after damage.',
    ],
    scene: 'rule110',
    alt: 'Rule 110 running from a random row in a narrow panel, its structures travelling across a regular background, beside seven of Life’s oscillators running in place, each labelled with its period: the blinker (2), the pulsar (3), the mold (4), octagon 2 (5), the figure eight (8), the tumbler (14) and the pentadecathlon (15).',
    sources: ['cook2004', 'brown2023', 'gemini', 'sirRobin', 'vonNeumann1966', 'mordvintsev2020'],
  },
  {
    id: 'yours',
    title: 'Your turn',
    body: [
      'Engineers grow the grains of cast metal in 3D automata, and physicists grow snow crystals. Others model how tumours invade tissue, or breed lifelike creatures in continuous automata such as Lenia. What will you grow?',
      'Pick a mode, change the rules, design a seed. When you find something that lasts, the Contests are waiting.',
    ],
    scene: 'finale',
    alt: 'The lab’s cube, swelling and turning slowly.',
    sources: ['rappaz1993', 'gandin1997', 'gravner2009', 'anderson2005', 'chan2019'],
    finale: true,
  },
];

/** The sources in the order the guide first cites them, as Sources and credits lists them. */
export function sourcesInOrder(steps = STEPS) {
  const seen = [];
  for (const step of steps) {
    for (const key of step.sources) if (!seen.includes(key)) seen.push(key);
  }
  return seen;
}

/** @returns {string} a source as one line of text: authors (year). Title. Venue. */
export function citation(source) {
  const year = source.year ? ` (${source.year})` : '';
  return `${source.authors}${year}. ${source.title}. ${source.venue}.`;
}
