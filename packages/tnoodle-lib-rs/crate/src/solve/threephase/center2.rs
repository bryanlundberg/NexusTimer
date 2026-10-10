use std::sync::OnceLock;

use super::cubes::CenterCube;
use super::moves::{MOVE2STD, cnk, swap4};

const PMV: [i32; 36] = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0,
];

#[derive(Clone, Copy, Default)]
pub struct Center2 {
    rl: [i32; 8],
    ct: [i32; 16],
    parity: i32,
}

impl Center2 {
    pub fn set(&mut self, cube: &CenterCube, edge_parity: i32) {
        for i in 0..16 {
            self.ct[i] = i32::from(cube.ct[i] % 3);
        }
        for i in 0..8 {
            self.rl[i] = i32::from(cube.ct[i + 16]);
        }
        self.parity = edge_parity;
    }

    pub fn rl_index(&self) -> usize {
        let mut index = 0;
        let mut r = 4;
        for i in (0..7).rev() {
            if self.rl[i] != self.rl[7] {
                index += cnk(i, r);
                r -= 1;
            }
        }
        (index * 2 + self.parity) as usize
    }

    fn set_rl(&mut self, index: usize) {
        self.parity = (index & 1) as i32;
        let mut index = (index >> 1) as i32;
        let mut r = 4;
        self.rl[7] = 0;
        for i in (0..7).rev() {
            if index >= cnk(i, r) {
                index -= cnk(i, r);
                r -= 1;
                self.rl[i] = 1;
            } else {
                self.rl[i] = 0;
            }
        }
    }

    pub fn ct_index(&self) -> usize {
        let mut index = 0;
        let mut r = 8;
        for i in (0..15).rev() {
            if self.ct[i] != self.ct[15] {
                index += cnk(i, r);
                r -= 1;
            }
        }
        index as usize
    }

    fn set_ct(&mut self, index: usize) {
        let mut index = index as i32;
        let mut r = 8;
        self.ct[15] = 0;
        for i in (0..15).rev() {
            if index >= cnk(i, r) {
                index -= cnk(i, r);
                r -= 1;
                self.ct[i] = 1;
            } else {
                self.ct[i] = 0;
            }
        }
    }

    fn do_move(&mut self, m: usize) {
        self.parity ^= PMV[m];
        let key = m % 3;
        let (ct, rl) = (&mut self.ct, &mut self.rl);
        match m / 3 {
            0 => swap4(ct, 0, 1, 2, 3, key),
            1 => swap4(rl, 0, 1, 2, 3, key),
            2 => swap4(ct, 8, 9, 10, 11, key),
            3 => swap4(ct, 4, 5, 6, 7, key),
            4 => swap4(rl, 4, 5, 6, 7, key),
            5 => swap4(ct, 12, 13, 14, 15, key),
            6 => {
                swap4(ct, 0, 1, 2, 3, key);
                swap4(rl, 0, 5, 4, 1, key);
                swap4(ct, 8, 9, 12, 13, key);
            }
            7 => {
                swap4(rl, 0, 1, 2, 3, key);
                swap4(ct, 1, 15, 5, 9, key);
                swap4(ct, 2, 12, 6, 10, key);
            }
            8 => {
                swap4(ct, 8, 9, 10, 11, key);
                swap4(rl, 0, 3, 6, 5, key);
                swap4(ct, 3, 2, 5, 4, key);
            }
            9 => {
                swap4(ct, 4, 5, 6, 7, key);
                swap4(rl, 3, 2, 7, 6, key);
                swap4(ct, 11, 10, 15, 14, key);
            }
            10 => {
                swap4(rl, 4, 5, 6, 7, key);
                swap4(ct, 0, 8, 4, 14, key);
                swap4(ct, 3, 11, 7, 13, key);
            }
            _ => {
                swap4(ct, 12, 13, 14, 15, key);
                swap4(rl, 1, 4, 7, 2, key);
                swap4(ct, 1, 0, 7, 6, key);
            }
        }
    }
}

pub struct Tables {
    pub rlmv: Vec<[u8; 28]>,
    pub ctmv: Vec<[u16; 28]>,
    pub ctprun: Vec<i8>,
}

pub fn tables() -> &'static Tables {
    static TABLES: OnceLock<Tables> = OnceLock::new();
    TABLES.get_or_init(|| {
        let mut c = Center2::default();
        let rlmv: Vec<[u8; 28]> = (0..70)
            .map(|i| {
                std::array::from_fn(|m| {
                    c.set_rl(i);
                    c.do_move(MOVE2STD[m]);
                    c.rl_index() as u8
                })
            })
            .collect();
        let ctmv: Vec<[u16; 28]> = (0..6435)
            .map(|i| {
                std::array::from_fn(|m| {
                    c.set_ct(i);
                    c.do_move(MOVE2STD[m]);
                    c.ct_index() as u16
                })
            })
            .collect();
        let total = 6435 * 70;
        let mut ctprun = vec![-1i8; total];
        for goal in [0, 18, 28, 46, 54, 56] {
            ctprun[goal] = 0;
        }
        let mut depth = 0i8;
        let mut done = 6;
        while done != total {
            for i in 0..total {
                if ctprun[i] != depth {
                    continue;
                }
                let (ct, rl) = (i / 70, i % 70);
                for m in 0..23 {
                    let index = usize::from(ctmv[ct][m]) * 70 + usize::from(rlmv[rl][m]);
                    if ctprun[index] == -1 {
                        ctprun[index] = depth + 1;
                        done += 1;
                    }
                }
            }
            depth += 1;
        }
        Tables { rlmv, ctmv, ctprun }
    })
}
