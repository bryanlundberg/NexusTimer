use std::sync::OnceLock;

use super::breadth_first;
use crate::random::Rng;

const FACTORIAL: [i32; 13] = [
    1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600,
];

fn ncr(n: i32, k: i32) -> i32 {
    if k < 0 || k > n {
        return 0;
    }
    (0..k).fold(1, |acc, i| acc * (n - i) / (i + 1))
}

const R: usize = 0;
const L: usize = 2;
const B: usize = 4;
const U: usize = 6;
const D: usize = 8;
const F: usize = 10;
const BR: usize = 12;
const BL: usize = 14;

const TOD: i32 = 3;

const TIUBL: i32 = 0;
const TIUBR: i32 = 1;
const TIUF: i32 = 2;
const TIFU: i32 = 3;
const TIFBR: i32 = 4;
const TIFBL: i32 = 5;
const TIBRU: i32 = 6;
const TIBRBL: i32 = 7;
const TIBRF: i32 = 8;
const TIBLU: i32 = 9;
const TIBLF: i32 = 10;
const TIBLBR: i32 = 11;
const TIRL: i32 = 0;
const TIRB: i32 = 1;
const TIRD: i32 = 2;
const TILB: i32 = 3;
const TILR: i32 = 4;
const TILD: i32 = 5;
const TIBR: i32 = 6;
const TIBL: i32 = 7;
const TIBD: i32 = 8;
const TIDR: i32 = 9;
const TIDL: i32 = 10;
const TIDB: i32 = 11;

const EUB: i32 = 0;
const EUR: i32 = 1;
const EUL: i32 = 2;
const EFL: i32 = 3;
const EFR: i32 = 4;
const ERBR: i32 = 5;
const EBRB: i32 = 6;
const EBLB: i32 = 7;
const ELBL: i32 = 8;
const EDF: i32 = 9;
const EDBR: i32 = 10;
const EDBL: i32 = 11;

const CUF: i32 = 0;
const CUBR: i32 = 1;
const CUBL: i32 = 2;
const CDL: i32 = 3;
const CDR: i32 = 4;
const CDB: i32 = 5;

const G2_EDGE_COLORS: [i32; 9] = [2, 0, 1, 1, 0, 0, 2, 2, 1];
const G2_EDGE_NORM: [i32; 9] = [0, 0, 0, 1, 1, 2, 1, 2, 2];
const G2_EDGE_NORM_INV: [[i32; 3]; 3] = [[EUR, EFR, ERBR], [EUL, EFL, ELBL], [EUB, EBRB, EBLB]];
const G3_EDGES: [[i32; 3]; 4] = [[EUB, EBRB, EBLB], [EUR, EFR, ERBR], [EUL, ELBL, EFL], [EDF, EDBR, EDBL]];
const CORNER_TRIPLE_COLOR_LOOKUP: [[i32; 6]; 4] = [
    [0, 0, 0, -1, -1, -1],
    [1, -1, -1, 0, 1, -1],
    [-1, 1, -1, -1, 0, 1],
    [-1, -1, 1, 1, -1, 0],
];

const ALL_EDGES_SIZE: i32 = 239500800;
const ALL_CORNER_PERMUTATION_SIZE: i32 = 360;
const ALL_CORNER_ORIENTATION_SIZE: i32 = 32;
const ALL_TRIANGLE_SIZE: i32 = 220 * 84 * 20;
const G1_TRIANGLES_SIZE: usize = 220;
const G1_EDGES_SIZE: usize = 440;
const G2_TRIANGLES_SIZE: usize = 84 * 20;
const G2_EDGES_SIZE: usize = 84 * 20 * 4;
const G2_TRIPLE_CORNER_SIZE: usize = 20 * 8;
const G2_TRIPLE_SIZE: usize = G2_TRIPLE_CORNER_SIZE * 220;
const G3_CORNERS_SIZE: usize = 360 * 32;
const G3_EDGE_SIZE: usize = 81;

const G1_MOVESET: [usize; 16] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const G2_MOVESET: [usize; 10] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const G3_MOVESET: [usize; 8] = [0, 1, 2, 3, 4, 5, 8, 9];
const MIN_G1_CANDIDATES: usize = 500;

const INVERSE_MOVE_NAMES: [&str; 16] = [
    "R'", "R", "L'", "L", "B'", "B", "U'", "U", "D'", "D", "F'", "F", "BR'", "BR", "BL'", "BL",
];

struct MoveEffect {
    cp: [i32; 6],
    co: [i32; 6],
    ep: [i32; 12],
    tp_u: [i32; 12],
    tp_r: [i32; 12],
}

fn move_effects() -> &'static [MoveEffect; 16] {
    static EFFECTS: OnceLock<[MoveEffect; 16]> = OnceLock::new();
    EFFECTS.get_or_init(|| {
        let base = |cp, co, ep, tp_u, tp_r| MoveEffect { cp, co, ep, tp_u, tp_r };
        let mut effects: [MoveEffect; 16] = std::array::from_fn(|_| MoveEffect {
            cp: [0; 6],
            co: [0; 6],
            ep: [0; 12],
            tp_u: [0; 12],
            tp_r: [0; 12],
        });
        effects[R] = base(
            [CDR, CUF, CUBL, CDL, CUBR, CDB],
            [1, 1, 0, 0, 0, 0],
            [EUB, EFR, EUL, EFL, ERBR, EUR, EBRB, EBLB, ELBL, EDF, EDBR, EDBL],
            [
                TIUBL, TIFU, TIFBR, TIBRF, TIBRU, TIFBL, TIUF, TIBRBL, TIUBR, TIBLU, TIBLF, TIBLBR,
            ],
            [TIRD, TIRL, TIRB, TILB, TILR, TILD, TIBR, TIBL, TIBD, TIDR, TIDL, TIDB],
        );
        effects[L] = base(
            [CUBL, CUBR, CDL, CUF, CDR, CDB],
            [1, 0, 1, 0, 0, 0],
            [EUB, EUR, ELBL, EUL, EFR, ERBR, EBRB, EBLB, EFL, EDF, EDBR, EDBL],
            [
                TIBLF, TIUBR, TIBLU, TIUBL, TIFBR, TIUF, TIBRU, TIBRBL, TIBRF, TIFBL, TIFU, TIBLBR,
            ],
            [TIRL, TIRB, TIRD, TILD, TILB, TILR, TIBR, TIBL, TIBD, TIDR, TIDL, TIDB],
        );
        effects[B] = base(
            [CUF, CDB, CUBR, CDL, CDR, CUBL],
            [0, 1, 1, 0, 0, 0],
            [EBRB, EUR, EUL, EFL, EFR, ERBR, EBLB, EUB, ELBL, EDF, EDBR, EDBL],
            [
                TIBRU, TIBRBL, TIUF, TIFU, TIFBR, TIFBL, TIBLBR, TIBLU, TIBRF, TIUBR, TIBLF, TIUBL,
            ],
            [TIRL, TIRB, TIRD, TILB, TILR, TILD, TIBD, TIBR, TIBL, TIDR, TIDL, TIDB],
        );
        effects[D] = base(
            [CUF, CUBR, CUBL, CDB, CDL, CDR],
            [0, 0, 0, 0, 0, 0],
            [EUB, EUR, EUL, EFL, EFR, ERBR, EBRB, EBLB, ELBL, EDBL, EDF, EDBR],
            [
                TIUBL, TIUBR, TIUF, TIFU, TIBLF, TIBLBR, TIBRU, TIFBR, TIFBL, TIBLU, TIBRBL, TIBRF,
            ],
            [TIRL, TIRB, TIRD, TILB, TILR, TILD, TIBR, TIBL, TIBD, TIDL, TIDB, TIDR],
        );
        effects[U] = base(
            [CUBR, CUBL, CUF, CDL, CDR, CDB],
            [0, 0, 0, 0, 0, 0],
            [EUL, EUB, EUR, EFL, EFR, ERBR, EBRB, EBLB, ELBL, EDF, EDBR, EDBL],
            [
                TIUF, TIUBL, TIUBR, TIFU, TIFBR, TIFBL, TIBRU, TIBRBL, TIBRF, TIBLU, TIBLF, TIBLBR,
            ],
            [TIBR, TIBL, TIRD, TIRL, TIRB, TILD, TILB, TILR, TIBD, TIDR, TIDL, TIDB],
        );
        effects[F] = base(
            [CDL, CUBR, CUBL, CDR, CUF, CDB],
            [1, 0, 0, 1, 0, 0],
            [EUB, EUR, EUL, EDF, EFL, ERBR, EBRB, EBLB, ELBL, EFR, EDBR, EDBL],
            [
                TIUBL, TIUBR, TIUF, TIFBL, TIFU, TIFBR, TIBRU, TIBRBL, TIBRF, TIBLU, TIBLF, TIBLBR,
            ],
            [TILD, TIRB, TILR, TILB, TIDL, TIDR, TIBR, TIBL, TIBD, TIRL, TIRD, TIDB],
        );
        effects[BR] = base(
            [CUF, CDR, CUBL, CDL, CDB, CUBR],
            [0, 1, 0, 0, 1, 0],
            [EUB, EUR, EUL, EFL, EFR, EDBR, ERBR, EBLB, ELBL, EDF, EBRB, EDBL],
            [
                TIUBL, TIUBR, TIUF, TIFU, TIFBR, TIFBL, TIBRF, TIBRU, TIBRBL, TIBLU, TIBLF, TIBLBR,
            ],
            [TIRL, TIDR, TIDB, TILB, TILR, TILD, TIRD, TIBL, TIRB, TIBD, TIDL, TIBR],
        );
        effects[BL] = base(
            [CUF, CUBR, CDB, CUBL, CDR, CDL],
            [0, 0, 1, 0, 0, 1],
            [EUB, EUR, EUL, EFL, EFR, ERBR, EBRB, EDBL, EBLB, EDF, EDBR, ELBL],
            [
                TIUBL, TIUBR, TIUF, TIFU, TIFBR, TIFBL, TIBRU, TIBRBL, TIBRF, TIBLBR, TIBLU, TIBLF,
            ],
            [TIRL, TIRB, TIRD, TIBD, TILR, TIBL, TIBR, TIDB, TIDL, TIDR, TILB, TILD],
        );
        for mv in (1..16).step_by(2) {
            let normal = &effects[mv - 1];
            let mut inverse = MoveEffect {
                cp: [0; 6],
                co: [0; 6],
                ep: [0; 12],
                tp_u: [0; 12],
                tp_r: [0; 12],
            };
            for i in 0..6 {
                inverse.cp[normal.cp[i] as usize] = i as i32;
            }
            for i in 0..6 {
                inverse.co[i] = normal.co[inverse.cp[i] as usize];
            }
            for i in 0..12 {
                inverse.ep[normal.ep[i] as usize] = i as i32;
                inverse.tp_u[normal.tp_u[i] as usize] = i as i32;
                inverse.tp_r[normal.tp_r[i] as usize] = i as i32;
            }
            effects[mv] = inverse;
        }
        effects
    })
}

fn is_parity(source: &[i32]) -> bool {
    let mut perm = [0i32; 12];
    let perm = &mut perm[..source.len()];
    perm.copy_from_slice(source);
    let mut swaps = 0;
    for i in 0..perm.len() {
        while perm[i] != i as i32 {
            let target = perm[i] as usize;
            perm.swap(i, target);
            swaps += 1;
        }
    }
    swaps % 2 == 1
}

fn pack_perm(arr: &[i32], parity: bool) -> i32 {
    let size = arr.len();
    let mut index = 0;
    for i in 0..size {
        let digit = arr[i + 1..].iter().filter(|&&x| x < arr[i]).count() as i32;
        index += FACTORIAL[size - 1 - i] * digit;
    }
    if parity { index / 2 } else { index }
}

fn unpack_perm(arr: &mut [i32], mut index: i32, parity: bool) {
    let size = arr.len();
    if parity {
        index *= 2;
    }
    let mut used = [false; 12];
    for i in 0..size {
        let f = FACTORIAL[size - 1 - i];
        let digit = index / f;
        index %= f;
        let value = (0..size)
            .filter(|&v| !used[v])
            .nth(digit as usize)
            .expect("valid lehmer digit");
        arr[i] = value as i32;
        used[value] = true;
    }
    if parity && is_parity(arr) {
        arr.swap(size - 2, size - 1);
    }
}

fn pack_subset(idx: &[i32]) -> i32 {
    idx.iter().enumerate().rev().map(|(i, &v)| ncr(v, i as i32 + 1)).sum()
}

fn unpack_subset(arr: &mut [i32], index: i32) {
    let subset_size = arr.len();
    let mut k = subset_size as i32;
    let mut remaining = index;
    for pos in 0..subset_size {
        let mut c = k - 1;
        while ncr(c + 1, k) <= remaining {
            c += 1;
        }
        arr[subset_size - 1 - pos] = c;
        remaining -= ncr(c, k);
        k -= 1;
    }
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct FtoCubie {
    corner_perm: [i32; 6],
    corner_ori: [i32; 6],
    edges: [i32; 12],
    tris_u: [i32; 12],
    tris_r: [i32; 12],
}

const ALL_TRIANGLES_COEFFICIENTS: [i32; 3] = [84 * 20, 20, 1];

impl FtoCubie {
    pub fn solved() -> FtoCubie {
        FtoCubie {
            corner_perm: [0, 1, 2, 3, 4, 5],
            corner_ori: [0; 6],
            edges: std::array::from_fn(|i| i as i32),
            tris_u: std::array::from_fn(|i| i as i32 / 3),
            tris_r: std::array::from_fn(|i| i as i32 / 3),
        }
    }

    pub fn turn(&self, mv: usize) -> FtoCubie {
        let e = &move_effects()[mv];
        let mut out = *self;
        for i in 0..6 {
            let from = e.cp[i] as usize;
            out.corner_perm[i] = self.corner_perm[from];
            out.corner_ori[i] = self.corner_ori[from] ^ e.co[i];
        }
        for i in 0..12 {
            out.edges[i] = self.edges[e.ep[i] as usize];
            out.tris_u[i] = self.tris_u[e.tp_u[i] as usize];
            out.tris_r[i] = self.tris_r[e.tp_r[i] as usize];
        }
        out
    }

    pub fn random(rng: &mut Rng) -> FtoCubie {
        let mut fto = FtoCubie::solved();
        unpack_perm(&mut fto.edges, rng.below(ALL_EDGES_SIZE as u32) as i32, true);
        fto.set_corner_orientation(rng.below(ALL_CORNER_ORIENTATION_SIZE as u32) as i32);
        unpack_perm(
            &mut fto.corner_perm,
            rng.below(ALL_CORNER_PERMUTATION_SIZE as u32) as i32,
            true,
        );
        fto.set_all_triangles(rng.below(ALL_TRIANGLE_SIZE as u32) as i32, 0);
        fto.set_all_triangles(rng.below(ALL_TRIANGLE_SIZE as u32) as i32, 1);
        fto
    }

    fn corner_orientation(&self) -> i32 {
        (0..5).fold(0, |acc, i| acc | self.corner_ori[i] << i)
    }

    fn set_corner_orientation(&mut self, index: i32) {
        for i in 0..5 {
            self.corner_ori[i] = (index >> i) & 1;
        }
        self.corner_ori[5] = (index.count_ones() % 2) as i32;
    }

    fn set_all_triangles(&mut self, index: i32, orbit: usize) {
        let mut loc = [[0i32; 3]; 3];
        let mut remaining = index;
        for color in 0..3 {
            let coefficient = ALL_TRIANGLES_COEFFICIENTS[color];
            let digit = remaining / coefficient;
            unpack_subset(&mut loc[color], digit);
            remaining -= coefficient * digit;
        }
        let triangles = if orbit == 1 { &mut self.tris_r } else { &mut self.tris_u };
        triangles.fill(3);
        for color in 0..3 {
            let mut nz = 0;
            let mut li = 0;
            for i in 0..12 {
                if triangles[i] < color as i32 {
                    continue;
                }
                if li < 3 && nz == loc[color][li] {
                    triangles[i] = color as i32;
                    li += 1;
                }
                nz += 1;
            }
        }
    }

    fn g1_pack_edges(&self) -> usize {
        let mut loc = [0i32; 3];
        let mut perm = [0i32; 3];
        let mut count = 0;
        for i in 0..12 {
            if self.edges[i] >= EDF {
                loc[count] = i as i32;
                perm[count] = self.edges[i] - EDF;
                count += 1;
            }
        }
        (pack_subset(&loc) * 2 + i32::from(is_parity(&perm))) as usize
    }

    fn g1_set_edges(&mut self, index: usize) {
        let mut loc = [0i32; 3];
        let mut perm = [EDF, EDBR, EDBL];
        if index % 2 == 1 {
            perm.swap(1, 2);
        }
        unpack_subset(&mut loc, (index / 2) as i32);
        self.edges.fill(-1);
        for i in 0..3 {
            self.edges[loc[i] as usize] = perm[i];
        }
    }

    fn g1_pack_triangles(&self) -> usize {
        let mut idx = [0i32; 3];
        let mut count = 0;
        for i in 0..12 {
            if self.tris_r[i] == TOD {
                idx[count] = i as i32;
                count += 1;
            }
        }
        pack_subset(&idx) as usize
    }

    fn g1_set_triangles(&mut self, index: usize) {
        let mut loc = [0i32; 3];
        unpack_subset(&mut loc, index as i32);
        self.tris_r.fill(-1);
        for &v in &loc {
            self.tris_r[v as usize] = TOD;
        }
    }

    fn g2_pack_edges(&self) -> usize {
        let mut used = [false; 9];
        let mut loc = [[0i32; 3]; 2];
        let mut perm = [[0i32; 3]; 2];
        for xo in 0..2 {
            let mut found = 0;
            let mut passed = 0;
            for i in 0..9 {
                let edge = self.edges[i] as usize;
                if G2_EDGE_COLORS[edge] == xo as i32 {
                    perm[xo][found] = G2_EDGE_NORM[edge];
                    loc[xo][found] = passed;
                    found += 1;
                    used[i] = true;
                    passed += 1;
                } else if !used[i] {
                    passed += 1;
                }
            }
        }
        let subset = pack_subset(&loc[1]) + pack_subset(&loc[0]) * 20;
        let parity = i32::from(is_parity(&perm[1])) * 2 + i32::from(is_parity(&perm[0]));
        (subset * 4 + parity) as usize
    }

    fn g2_set_edges(&mut self, index: usize) {
        let subset = (index / 4) as i32;
        let parity_index = index % 4;
        let mut loc = [[0i32; 3]; 2];
        unpack_subset(&mut loc[0], subset / 20);
        unpack_subset(&mut loc[1], subset % 20);
        let mut perm = [G2_EDGE_NORM_INV[0], G2_EDGE_NORM_INV[1]];
        for (i, p) in perm.iter_mut().enumerate() {
            if (parity_index >> i) & 1 == 1 {
                p.swap(1, 2);
            }
        }
        self.edges.fill(-1);
        self.edges[EDF as usize] = EDF;
        self.edges[EDBL as usize] = EDBL;
        self.edges[EDBR as usize] = EDBR;
        for i in 0..3 {
            self.edges[loc[0][i] as usize] = perm[0][i];
        }
        let mut nz = 0;
        let mut li = 0;
        for i in 0..9 {
            if self.edges[i] != -1 {
                continue;
            }
            if li < 3 && nz == loc[1][li] {
                self.edges[i] = perm[1][li];
                li += 1;
            }
            nz += 1;
        }
        let mut bloc = [0usize; 3];
        li = 0;
        for i in 0..9 {
            if self.edges[i] == -1 {
                bloc[li] = i;
                self.edges[i] = G2_EDGE_NORM_INV[2][li];
                li += 1;
            }
        }
        if is_parity(&self.edges) {
            self.edges.swap(bloc[0], bloc[1]);
        }
    }

    fn g2_pack_triangles(&self) -> usize {
        let mut used = [false; 9];
        let mut loc = [[0i32; 3]; 2];
        for xo in 0..2 {
            let mut found = 0;
            let mut passed = 0;
            for i in 0..9 {
                if self.tris_r[i] == xo as i32 {
                    loc[xo][found] = passed;
                    found += 1;
                    used[i] = true;
                    passed += 1;
                } else if !used[i] {
                    passed += 1;
                }
            }
        }
        (pack_subset(&loc[1]) + pack_subset(&loc[0]) * 20) as usize
    }

    fn g2_set_triangles(&mut self, index: usize) {
        let mut loc0 = [0i32; 3];
        let mut loc1 = [0i32; 3];
        unpack_subset(&mut loc0, (index / 20) as i32);
        unpack_subset(&mut loc1, (index % 20) as i32);
        self.tris_r[..9].fill(2);
        for &v in &loc0 {
            self.tris_r[v as usize] = 0;
        }
        let mut nz = 0;
        let mut li = 0;
        for i in 0..9 {
            if self.tris_r[i] == 0 {
                continue;
            }
            if li < 3 && nz == loc1[li] {
                self.tris_r[i] = 1;
                li += 1;
            }
            nz += 1;
        }
        self.tris_r[9..].fill(TOD);
    }

    fn g2_pack_triples(&self, color: usize) -> usize {
        let mut tris = [0i32; 3];
        let mut found = 0;
        for i in 0..12 {
            if self.tris_u[i] == color as i32 {
                tris[found] = i as i32;
                found += 1;
            }
        }
        let mut idx = [0i32; 3];
        let mut orientation = 0;
        found = 0;
        for i in 0..6 {
            let corner = self.corner_perm[i];
            if corner == -1 {
                continue;
            }
            let parity = CORNER_TRIPLE_COLOR_LOOKUP[color][corner as usize];
            if parity != -1 {
                orientation |= (parity ^ self.corner_ori[i]) << found;
                idx[found] = i as i32;
                found += 1;
            }
        }
        G2_TRIPLE_CORNER_SIZE * pack_subset(&tris) as usize + (pack_subset(&idx) * 8 + orientation) as usize
    }

    fn g2_set_triples(&mut self, index: usize, color: usize) {
        let mut loc = [0i32; 3];
        unpack_subset(&mut loc, (index / G2_TRIPLE_CORNER_SIZE) as i32);
        self.tris_u.fill(-1);
        for &v in &loc {
            self.tris_u[v as usize] = color as i32;
        }
        let corners = index % G2_TRIPLE_CORNER_SIZE;
        unpack_subset(&mut loc, (corners / 8) as i32);
        let orientation = (corners % 8) as i32;
        let mut relevant = [0i32; 3];
        let mut found = 0;
        for i in 0..6 {
            if CORNER_TRIPLE_COLOR_LOOKUP[color][i] != -1 {
                relevant[found] = i as i32;
                found += 1;
            }
        }
        self.corner_perm.fill(-1);
        self.corner_ori.fill(-1);
        for i in 0..3 {
            let position = loc[i] as usize;
            let ori = (orientation >> i) & 1;
            self.corner_perm[position] = relevant[i];
            self.corner_ori[position] = ori ^ CORNER_TRIPLE_COLOR_LOOKUP[color][relevant[i] as usize];
        }
    }

    fn g3_pack_corners(&self) -> usize {
        (pack_perm(&self.corner_perm, true) * ALL_CORNER_ORIENTATION_SIZE + self.corner_orientation()) as usize
    }

    fn g3_set_corners(&mut self, index: usize) {
        unpack_perm(&mut self.corner_perm, index as i32 / ALL_CORNER_ORIENTATION_SIZE, true);
        self.set_corner_orientation(index as i32 % ALL_CORNER_ORIENTATION_SIZE);
    }

    fn g3_pack_edges(&self) -> usize {
        let mut loc = [0i32; 4];
        for axis in 0..4 {
            for i in 0..3 {
                if G3_EDGES[axis][i] == self.edges[G3_EDGES[axis][0] as usize] {
                    loc[axis] = i as i32;
                }
            }
        }
        (27 * loc[0] + 9 * loc[1] + 3 * loc[2] + loc[3]) as usize
    }

    fn g3_set_edges(&mut self, index: usize) {
        self.edges = std::array::from_fn(|i| i as i32);
        let mut remaining = index as i32;
        for axis in 0..4 {
            let coefficient = 3i32.pow(3 - axis as u32);
            let digit = remaining / coefficient;
            for _ in 0..3 {
                if self.edges[G3_EDGES[axis][0] as usize] == G3_EDGES[axis][digit as usize] {
                    break;
                }
                for i in 0..2 {
                    self.edges
                        .swap(G3_EDGES[axis][0] as usize, G3_EDGES[axis][i + 1] as usize);
                }
            }
            remaining -= coefficient * digit;
        }
    }

    #[cfg(feature = "oracle")]
    pub fn describe(&self) -> String {
        let join = |values: &[i32]| values.iter().map(i32::to_string).collect::<Vec<_>>().join(" ");
        [
            &self.corner_perm[..],
            &self.corner_ori,
            &self.edges,
            &self.tris_u,
            &self.tris_r,
        ]
        .map(join)
        .join(",")
    }

    pub fn within_one_move(&self) -> bool {
        let solved = FtoCubie::solved();
        *self == solved || (0..16).any(|mv| self.turn(mv) == solved)
    }
}

struct Tables {
    g1_edge_moves: Vec<[u16; 16]>,
    g1_tri_moves: Vec<[u16; 16]>,
    g2_tri_moves: Vec<[u16; 10]>,
    g2_edge_moves: Vec<[u16; 10]>,
    g2_triple_moves: Vec<[u16; 10]>,
    g3_edge_moves: Vec<[u16; 10]>,
    g3_corner_moves: Vec<[u16; 10]>,
    g1_prun: Vec<u8>,
    g2_triple_prun: Vec<u8>,
    g2_txe_prun: Vec<u8>,
    g3_corner_prun: Vec<u8>,
    solved_g3_edges: usize,
    solved_g3_corners: usize,
    invalid_moves: [u32; 8],
}

fn move_table<const W: usize>(
    size: usize,
    moveset: &[usize],
    set: impl Fn(&mut FtoCubie, usize),
    get: impl Fn(&FtoCubie) -> usize,
) -> Vec<[u16; W]> {
    let mut fto = FtoCubie::solved();
    (0..size)
        .map(|index| {
            set(&mut fto, index);
            let mut row = [0u16; W];
            for &mv in moveset {
                row[mv] = get(&fto.turn(mv)) as u16;
            }
            row
        })
        .collect()
}

fn tables() -> &'static Tables {
    static TABLES: OnceLock<Tables> = OnceLock::new();
    TABLES.get_or_init(|| {
        let solved = FtoCubie::solved();
        let g1_edge_moves = move_table(
            G1_EDGES_SIZE,
            &G1_MOVESET,
            FtoCubie::g1_set_edges,
            FtoCubie::g1_pack_edges,
        );
        let g1_tri_moves = move_table(
            G1_TRIANGLES_SIZE,
            &G1_MOVESET,
            FtoCubie::g1_set_triangles,
            FtoCubie::g1_pack_triangles,
        );
        let g1_prun = breadth_first(
            G1_EDGES_SIZE * G1_TRIANGLES_SIZE,
            &[solved.g1_pack_edges() * G1_TRIANGLES_SIZE + solved.g1_pack_triangles()],
            &G1_MOVESET,
            |i, mv| {
                usize::from(g1_edge_moves[i / G1_TRIANGLES_SIZE][mv]) * G1_TRIANGLES_SIZE
                    + usize::from(g1_tri_moves[i % G1_TRIANGLES_SIZE][mv])
            },
        );
        let g2_tri_moves = move_table(
            G2_TRIANGLES_SIZE,
            &G2_MOVESET,
            FtoCubie::g2_set_triangles,
            FtoCubie::g2_pack_triangles,
        );
        let g2_edge_moves = move_table(
            G2_EDGES_SIZE,
            &G2_MOVESET,
            FtoCubie::g2_set_edges,
            FtoCubie::g2_pack_edges,
        );
        let g2_triple_moves = move_table(
            G2_TRIPLE_SIZE,
            &G2_MOVESET,
            |f, i| f.g2_set_triples(i, 0),
            |f| f.g2_pack_triples(0),
        );
        let g2_txe_prun = breadth_first(
            G2_EDGES_SIZE * G2_TRIANGLES_SIZE,
            &[solved.g2_pack_edges() * G2_TRIANGLES_SIZE + solved.g2_pack_triangles()],
            &G2_MOVESET,
            |i, mv| {
                usize::from(g2_edge_moves[i / G2_TRIANGLES_SIZE][mv]) * G2_TRIANGLES_SIZE
                    + usize::from(g2_tri_moves[i % G2_TRIANGLES_SIZE][mv])
            },
        );
        let triple_goals = breadth_first(G2_TRIPLE_SIZE, &[solved.g2_pack_triples(0)], &G3_MOVESET, |i, mv| {
            usize::from(g2_triple_moves[i][mv])
        });
        let goals: Vec<usize> = (0..G2_TRIPLE_SIZE).filter(|&i| triple_goals[i] != u8::MAX).collect();
        let g2_triple_prun = breadth_first(G2_TRIPLE_SIZE, &goals, &G2_MOVESET, |i, mv| {
            usize::from(g2_triple_moves[i][mv])
        });
        let g3_edge_moves = move_table(
            G3_EDGE_SIZE,
            &G3_MOVESET,
            FtoCubie::g3_set_edges,
            FtoCubie::g3_pack_edges,
        );
        let g3_corner_moves = move_table(
            G3_CORNERS_SIZE,
            &G3_MOVESET,
            FtoCubie::g3_set_corners,
            FtoCubie::g3_pack_corners,
        );
        let g3_corner_prun = breadth_first(G3_CORNERS_SIZE, &[solved.g3_pack_corners()], &G3_MOVESET, |i, mv| {
            usize::from(g3_corner_moves[i][mv])
        });
        let mut invalid_moves = [0u32; 8];
        for a1 in 0..8 {
            invalid_moves[a1] = 1 << a1;
            for a2 in 0..a1 {
                if solved.turn(a1 * 2).turn(a2 * 2) == solved.turn(a2 * 2).turn(a1 * 2) {
                    invalid_moves[a1] |= 1 << a2;
                }
            }
        }
        Tables {
            g1_edge_moves,
            g1_tri_moves,
            g2_tri_moves,
            g2_edge_moves,
            g2_triple_moves,
            g3_edge_moves,
            g3_corner_moves,
            g1_prun,
            g2_triple_prun,
            g2_txe_prun,
            g3_corner_prun,
            solved_g3_edges: solved.g3_pack_edges(),
            solved_g3_corners: solved.g3_pack_corners(),
            invalid_moves,
        }
    })
}

fn valid_after(t: &Tables, moves: &[usize], mv: usize) -> bool {
    match moves.last() {
        Some(&last) => (t.invalid_moves[last / 2] >> (mv / 2)) & 1 != 1,
        None => true,
    }
}

fn g1_search(
    t: &Tables,
    depth: i32,
    edge: usize,
    tri: usize,
    candidates: &mut Vec<Vec<usize>>,
    moves: &mut Vec<usize>,
) {
    let prun = i32::from(t.g1_prun[edge * G1_TRIANGLES_SIZE + tri]);
    if depth < prun {
        return;
    }
    if prun == 0 && depth == 0 {
        candidates.push(moves.clone());
        return;
    }
    if depth <= 0 {
        return;
    }
    for &mv in &G1_MOVESET {
        if !valid_after(t, moves, mv) {
            continue;
        }
        moves.push(mv);
        g1_search(
            t,
            depth - 1,
            usize::from(t.g1_edge_moves[edge][mv]),
            usize::from(t.g1_tri_moves[tri][mv]),
            candidates,
            moves,
        );
        moves.pop();
    }
}

fn g2_search(t: &Tables, depth: i32, state: [usize; 6], moves: &mut Vec<usize>) -> bool {
    let [edge, tri, tp0, tp1, tp2, tp3] = state;
    let triple = [tp0, tp1, tp2, tp3]
        .iter()
        .map(|&i| i32::from(t.g2_triple_prun[i]))
        .max()
        .unwrap_or(0);
    if depth < triple {
        return false;
    }
    let txe = i32::from(t.g2_txe_prun[edge * G2_TRIANGLES_SIZE + tri]);
    if depth < txe {
        return false;
    }
    if triple == 0 && txe == 0 {
        return true;
    }
    if depth == 0 {
        return false;
    }
    for &mv in &G2_MOVESET {
        if !valid_after(t, moves, mv) {
            continue;
        }
        moves.push(mv);
        let next = [
            usize::from(t.g2_edge_moves[edge][mv]),
            usize::from(t.g2_tri_moves[tri][mv]),
            usize::from(t.g2_triple_moves[tp0][mv]),
            usize::from(t.g2_triple_moves[tp1][mv]),
            usize::from(t.g2_triple_moves[tp2][mv]),
            usize::from(t.g2_triple_moves[tp3][mv]),
        ];
        if g2_search(t, depth - 1, next, moves) {
            return true;
        }
        moves.pop();
    }
    false
}

fn g3_search(t: &Tables, depth: i32, edges: usize, corners: usize, moves: &mut Vec<usize>) -> bool {
    if depth < i32::from(t.g3_corner_prun[corners]) {
        return false;
    }
    if corners == t.solved_g3_corners && edges == t.solved_g3_edges {
        return true;
    }
    if depth == 0 {
        return false;
    }
    for &mv in &G3_MOVESET {
        if !valid_after(t, moves, mv) {
            continue;
        }
        moves.push(mv);
        if g3_search(
            t,
            depth - 1,
            usize::from(t.g3_edge_moves[edges][mv]),
            usize::from(t.g3_corner_moves[corners][mv]),
            moves,
        ) {
            return true;
        }
        moves.pop();
    }
    false
}

fn apply(fto: &FtoCubie, moves: &[usize]) -> FtoCubie {
    moves.iter().fold(*fto, |f, &mv| f.turn(mv))
}

pub fn solution(fto: &FtoCubie) -> Vec<usize> {
    let t = tables();
    let mut candidates = Vec::new();
    let mut moves = Vec::new();
    let (edge, tri) = (fto.g1_pack_edges(), fto.g1_pack_triangles());
    let mut depth = 0;
    while candidates.len() < MIN_G1_CANDIDATES {
        g1_search(t, depth, edge, tri, &mut candidates, &mut moves);
        depth += 1;
    }

    let states: Vec<[usize; 6]> = candidates
        .iter()
        .map(|candidate| {
            let c = apply(fto, candidate);
            [
                c.g2_pack_edges(),
                c.g2_pack_triangles(),
                c.g2_pack_triples(0),
                c.g2_pack_triples(1),
                c.g2_pack_triples(2),
                c.g2_pack_triples(3),
            ]
        })
        .collect();
    let mut depth = 0;
    let mut full = 'phase2: loop {
        for (candidate, state) in candidates.iter().zip(&states) {
            let search_depth = depth - candidate.len() as i32;
            if search_depth < 0 {
                continue;
            }
            let mut g2 = Vec::new();
            if g2_search(t, search_depth, *state, &mut g2) {
                break 'phase2 [candidate.as_slice(), &g2].concat();
            }
        }
        depth += 1;
    };

    let g2_state = apply(fto, &full);
    let (edges, corners) = (g2_state.g3_pack_edges(), g2_state.g3_pack_corners());
    let mut g3 = Vec::new();
    depth = 0;
    while !g3_search(t, depth, edges, corners, &mut g3) {
        depth += 1;
    }
    full.extend(g3);
    full
}

pub fn scramble_string(solution: &[usize]) -> String {
    solution
        .iter()
        .rev()
        .map(|&mv| INVERSE_MOVE_NAMES[mv])
        .collect::<Vec<_>>()
        .join(" ")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn coordinates_round_trip() {
        let mut fto = FtoCubie::solved();
        for i in 0..G1_EDGES_SIZE {
            fto.g1_set_edges(i);
            assert_eq!(fto.g1_pack_edges(), i);
        }
        for i in 0..G2_EDGES_SIZE {
            fto.g2_set_edges(i);
            assert_eq!(fto.g2_pack_edges(), i);
        }
        for i in 0..G2_TRIPLE_SIZE {
            fto.g2_set_triples(i, 0);
            assert_eq!(fto.g2_pack_triples(0), i);
        }
        for i in 0..G3_CORNERS_SIZE {
            fto.g3_set_corners(i);
            assert_eq!(fto.g3_pack_corners(), i);
        }
        for i in 0..G3_EDGE_SIZE {
            fto.g3_set_edges(i);
            assert_eq!(fto.g3_pack_edges(), i);
        }
    }

    #[test]
    fn solutions_solve_random_states() {
        let mut rng = Rng::seeded(1);
        for _ in 0..10 {
            let fto = FtoCubie::random(&mut rng);
            let solution = solution(&fto);
            assert_eq!(apply(&fto, &solution), FtoCubie::solved());
        }
    }
}
