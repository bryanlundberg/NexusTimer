use std::sync::OnceLock;

use super::center1::{self, Center1};
use super::moves::{DX1, MOVE2STR, parity, swap4};
use crate::random::Rng;

const FACTORIAL: [i32; 13] = [
    1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600,
];

fn set_8_perm(arr: &mut [u8; 8], mut index: i32) {
    let mut val: i64 = 0x76543210;
    for i in 0..7 {
        let p = FACTORIAL[7 - i];
        let mut v = index / p;
        index -= v * p;
        v <<= 2;
        arr[i] = ((val >> v) & 0xf) as u8;
        let mask = (1i64 << v) - 1;
        val = (val & mask) + ((val >> 4) & !mask);
    }
    arr[7] = val as u8;
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct CornerCube {
    pub cp: [u8; 8],
    pub co: [u8; 8],
}

impl CornerCube {
    const SOLVED: CornerCube = CornerCube {
        cp: [0, 1, 2, 3, 4, 5, 6, 7],
        co: [0; 8],
    };

    fn from_coords(perm: i32, mut twist: i32) -> CornerCube {
        let mut cube = CornerCube::SOLVED;
        set_8_perm(&mut cube.cp, perm);
        let mut sum = 0;
        for i in (0..7).rev() {
            cube.co[i] = (twist % 3) as u8;
            sum += i32::from(cube.co[i]);
            twist /= 3;
        }
        cube.co[7] = ((15 - sum) % 3) as u8;
        cube
    }

    fn multiply(&self, other: &CornerCube) -> CornerCube {
        let mut product = CornerCube::SOLVED;
        for corner in 0..8 {
            let from = usize::from(other.cp[corner]);
            product.cp[corner] = self.cp[from];
            product.co[corner] = (self.co[from] + other.co[corner]) % 3;
        }
        product
    }

    fn move_cubes() -> &'static [CornerCube; 18] {
        static MOVES: OnceLock<[CornerCube; 18]> = OnceLock::new();
        MOVES.get_or_init(|| {
            let mut moves = [CornerCube::SOLVED; 18];
            for (face, (perm, twist)) in [(15120, 0), (21021, 1494), (8064, 1236), (9, 0), (1230, 412), (224, 137)]
                .into_iter()
                .enumerate()
            {
                moves[face * 3] = CornerCube::from_coords(perm, twist);
                moves[face * 3 + 1] = moves[face * 3].multiply(&moves[face * 3]);
                moves[face * 3 + 2] = moves[face * 3 + 1].multiply(&moves[face * 3]);
            }
            moves
        })
    }

    pub fn do_move(&mut self, m: usize) {
        *self = self.multiply(&CornerCube::move_cubes()[m]);
    }

    pub fn parity(&self) -> i32 {
        parity(&self.cp)
    }
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct EdgeCube {
    pub ep: [u8; 24],
}

impl EdgeCube {
    fn solved() -> EdgeCube {
        EdgeCube {
            ep: std::array::from_fn(|i| i as u8),
        }
    }

    pub fn parity(&self) -> i32 {
        parity(&self.ep)
    }

    pub fn check_edge(&self) -> bool {
        let mut ck: i32 = 0;
        let mut odd = false;
        for i in 0..12 {
            ck |= 1 << self.ep[i];
            odd ^= self.ep[i] >= 12;
        }
        ck &= ck >> 12;
        ck == 0 && !odd
    }

    pub fn do_move(&mut self, m: usize) {
        let key = m % 3;
        let ep = &mut self.ep;
        match m / 3 {
            0 => {
                swap4(ep, 0, 1, 2, 3, key);
                swap4(ep, 12, 13, 14, 15, key);
            }
            1 => {
                swap4(ep, 11, 15, 10, 19, key);
                swap4(ep, 23, 3, 22, 7, key);
            }
            2 => {
                swap4(ep, 0, 11, 6, 8, key);
                swap4(ep, 12, 23, 18, 20, key);
            }
            3 => {
                swap4(ep, 4, 5, 6, 7, key);
                swap4(ep, 16, 17, 18, 19, key);
            }
            4 => {
                swap4(ep, 1, 20, 5, 21, key);
                swap4(ep, 13, 8, 17, 9, key);
            }
            5 => {
                swap4(ep, 2, 9, 4, 10, key);
                swap4(ep, 14, 21, 16, 22, key);
            }
            6 => {
                swap4(ep, 0, 1, 2, 3, key);
                swap4(ep, 12, 13, 14, 15, key);
                swap4(ep, 9, 22, 11, 20, key);
            }
            7 => {
                swap4(ep, 11, 15, 10, 19, key);
                swap4(ep, 23, 3, 22, 7, key);
                swap4(ep, 2, 16, 6, 12, key);
            }
            8 => {
                swap4(ep, 0, 11, 6, 8, key);
                swap4(ep, 12, 23, 18, 20, key);
                swap4(ep, 3, 19, 5, 13, key);
            }
            9 => {
                swap4(ep, 4, 5, 6, 7, key);
                swap4(ep, 16, 17, 18, 19, key);
                swap4(ep, 8, 23, 10, 21, key);
            }
            10 => {
                swap4(ep, 1, 20, 5, 21, key);
                swap4(ep, 13, 8, 17, 9, key);
                swap4(ep, 14, 0, 18, 4, key);
            }
            _ => {
                swap4(ep, 2, 9, 4, 10, key);
                swap4(ep, 14, 21, 16, 22, key);
                swap4(ep, 7, 15, 1, 17, key);
            }
        }
    }

    fn fill_333_facelet(&self, facelet: &mut [u8; 54]) {
        const U: u8 = 0;
        const R: u8 = 1;
        const F: u8 = 2;
        const D: u8 = 3;
        const L: u8 = 4;
        const B: u8 = 5;
        const EDGE_COLOR: [[u8; 2]; 12] = [
            [F, U],
            [L, U],
            [B, U],
            [R, U],
            [B, D],
            [L, D],
            [F, D],
            [R, D],
            [F, L],
            [B, L],
            [B, R],
            [F, R],
        ];
        const EDGE_MAP: [usize; 24] = [
            19, 37, 46, 10, 52, 43, 25, 16, 21, 50, 48, 23, 7, 3, 1, 5, 34, 30, 28, 32, 41, 39, 14, 12,
        ];
        for i in 0..24 {
            let piece = usize::from(self.ep[i]);
            facelet[EDGE_MAP[i]] = b"URFDLB"[usize::from(EDGE_COLOR[piece % 12][piece / 12])];
        }
    }
}

pub const CENTER_FACES: [u8; 24] = [0, 0, 0, 0, 3, 3, 3, 3, 2, 2, 2, 2, 5, 5, 5, 5, 1, 1, 1, 1, 4, 4, 4, 4];

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct CenterCube {
    pub ct: [u8; 24],
}

impl CenterCube {
    fn solved() -> CenterCube {
        CenterCube { ct: CENTER_FACES }
    }

    pub fn do_move(&mut self, m: usize) {
        let key = m % 3;
        let ct = &mut self.ct;
        match m / 3 {
            0 => swap4(ct, 0, 1, 2, 3, key),
            1 => swap4(ct, 16, 17, 18, 19, key),
            2 => swap4(ct, 8, 9, 10, 11, key),
            3 => swap4(ct, 4, 5, 6, 7, key),
            4 => swap4(ct, 20, 21, 22, 23, key),
            5 => swap4(ct, 12, 13, 14, 15, key),
            6 => {
                swap4(ct, 0, 1, 2, 3, key);
                swap4(ct, 8, 20, 12, 16, key);
                swap4(ct, 9, 21, 13, 17, key);
            }
            7 => {
                swap4(ct, 16, 17, 18, 19, key);
                swap4(ct, 1, 15, 5, 9, key);
                swap4(ct, 2, 12, 6, 10, key);
            }
            8 => {
                swap4(ct, 8, 9, 10, 11, key);
                swap4(ct, 2, 19, 4, 21, key);
                swap4(ct, 3, 16, 5, 22, key);
            }
            9 => {
                swap4(ct, 4, 5, 6, 7, key);
                swap4(ct, 10, 18, 14, 22, key);
                swap4(ct, 11, 19, 15, 23, key);
            }
            10 => {
                swap4(ct, 20, 21, 22, 23, key);
                swap4(ct, 0, 8, 4, 14, key);
                swap4(ct, 3, 11, 7, 13, key);
            }
            _ => {
                swap4(ct, 12, 13, 14, 15, key);
                swap4(ct, 1, 20, 7, 18, key);
                swap4(ct, 0, 23, 6, 17, key);
            }
        }
    }

    fn fill_333_facelet(&self, facelet: &mut [u8; 54]) {
        const CENTER_333_MAP: [usize; 6] = [0, 4, 2, 1, 5, 3];
        for (face, &block) in CENTER_333_MAP.iter().enumerate() {
            let idx = block << 2;
            debug_assert!(
                self.ct[idx..idx + 4].iter().all(|&c| c == self.ct[idx]),
                "unsolved center"
            );
            facelet[4 + face * 9] = b"URFDLB"[usize::from(self.ct[idx])];
        }
    }
}

#[derive(Clone, Debug)]
pub struct FullCube {
    edge: EdgeCube,
    center: CenterCube,
    corner: CornerCube,
    pub value: i32,
    pub add1: bool,
    pub length1: usize,
    pub length2: usize,
    pub sym: usize,
    move_buffer: [u8; 80],
    move_length: usize,
    edge_avail: usize,
    center_avail: usize,
    corner_avail: usize,
}

impl FullCube {
    pub fn solved() -> FullCube {
        FullCube {
            edge: EdgeCube::solved(),
            center: CenterCube::solved(),
            corner: CornerCube::SOLVED,
            value: 0,
            add1: false,
            length1: 0,
            length2: 0,
            sym: 0,
            move_buffer: [0; 80],
            move_length: 0,
            edge_avail: 0,
            center_avail: 0,
            corner_avail: 0,
        }
    }

    pub fn random(rng: &mut Rng) -> FullCube {
        let mut cube = FullCube::solved();
        for i in 0..23 {
            let t = i + rng.below_usize(24 - i);
            cube.edge.ep.swap(i, t);
        }
        for i in 0..23 {
            let t = i + rng.below_usize(24 - i);
            if cube.center.ct[t] != cube.center.ct[i] {
                cube.center.ct.swap(i, t);
            }
        }
        cube.corner = CornerCube::from_coords(rng.below(40320) as i32, rng.below(2187) as i32);
        cube
    }

    pub fn push_move(&mut self, m: usize) {
        self.move_buffer[self.move_length] = m as u8;
        self.move_length += 1;
    }

    pub fn edge(&mut self) -> &EdgeCube {
        while self.edge_avail < self.move_length {
            self.edge.do_move(usize::from(self.move_buffer[self.edge_avail]));
            self.edge_avail += 1;
        }
        &self.edge
    }

    pub fn center(&mut self) -> &CenterCube {
        while self.center_avail < self.move_length {
            self.center.do_move(usize::from(self.move_buffer[self.center_avail]));
            self.center_avail += 1;
        }
        &self.center
    }

    pub fn corner(&mut self) -> &CornerCube {
        while self.corner_avail < self.move_length {
            self.corner
                .do_move(usize::from(self.move_buffer[self.corner_avail]) % 18);
            self.corner_avail += 1;
        }
        &self.corner
    }

    pub fn facelets_333(&mut self) -> [u8; 54] {
        let mut facelet = [0u8; 54];
        self.edge().fill_333_facelet(&mut facelet);
        self.center().fill_333_facelet(&mut facelet);
        let corner = *self.corner();
        const CORNER_FACELET: [[u8; 3]; 8] = [
            [8, 9, 20],
            [6, 18, 38],
            [0, 36, 47],
            [2, 45, 11],
            [29, 26, 15],
            [27, 44, 24],
            [33, 53, 42],
            [35, 17, 51],
        ];
        for c in 0..8 {
            let j = usize::from(corner.cp[c]);
            let ori = usize::from(corner.co[c]);
            for n in 0..3 {
                facelet[usize::from(CORNER_FACELET[c][(n + ori) % 3])] =
                    b"URFDLB"[usize::from(CORNER_FACELET[j][n] / 9)];
            }
        }
        facelet
    }

    pub fn move_string(&mut self) -> Vec<&'static str> {
        const MOVE2ROT: [usize; 9] = [35, 1, 34, 2, 4, 6, 22, 5, 19];
        let t = center1::tables();
        let mut fixed = Vec::with_capacity(self.move_length);
        fixed.extend(self.move_buffer[..self.length1].iter().map(|&m| usize::from(m)));
        let mut sym = self.sym;
        let start = self.length1 + if self.add1 { 2 } else { 0 };
        for &m in &self.move_buffer[start..self.move_length] {
            let mapped = t.symmove[sym][usize::from(m)];
            if mapped >= DX1 {
                fixed.push(mapped - 9);
                sym = t.symmult[sym][MOVE2ROT[mapped - DX1]];
            } else {
                fixed.push(mapped);
            }
        }
        let center = *self.center();
        let mut sym = t.symmult[t.syminv[sym]][Center1::solved_sym(&center)];
        let mut moves = Vec::with_capacity(fixed.len());
        for &m in fixed.iter().rev() {
            let inverse = m / 3 * 3 + (2 - m % 3);
            let mapped = t.symmove[sym][inverse];
            if mapped >= DX1 {
                moves.push(MOVE2STR[mapped - 9]);
                sym = t.symmult[sym][MOVE2ROT[mapped - DX1]];
            } else {
                moves.push(MOVE2STR[mapped]);
            }
        }
        moves
    }
}
