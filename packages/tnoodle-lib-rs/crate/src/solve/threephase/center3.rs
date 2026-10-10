use std::sync::OnceLock;

use super::cubes::CenterCube;
use super::moves::{cnk, swap4};

pub const N_STATES: usize = 35 * 35 * 12 * 2;
const PMOVE: [i32; 20] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1];
const RL2STD: [usize; 12] = [0, 9, 14, 23, 27, 28, 41, 42, 46, 55, 60, 69];

#[derive(Clone, Copy, Default)]
pub struct Center3 {
    ud: [i32; 8],
    rl: [i32; 8],
    fb: [i32; 8],
    parity: i32,
}

impl Center3 {
    pub fn set(&mut self, cube: &CenterCube, edge_corner_parity: i32) {
        let c = |i: usize| cube.ct[i] % 3;
        let parity = if (c(0) > c(8)) ^ (c(8) > c(16)) ^ (c(0) > c(16)) {
            0
        } else {
            1
        };
        for i in 0..8 {
            self.ud[i] = i32::from(cube.ct[i] / 3) ^ 1;
            self.fb[i] = i32::from(cube.ct[i + 8] / 3) ^ 1;
            self.rl[i] = i32::from(cube.ct[i + 16] / 3) ^ 1 ^ parity;
        }
        self.parity = parity ^ edge_corner_parity;
    }

    pub fn index(&self) -> usize {
        let pattern = |side: &[i32; 8]| {
            let mut index = 0;
            let mut r = 4;
            for i in (0..7).rev() {
                if side[i] != side[7] {
                    index += cnk(i, r);
                    r -= 1;
                }
            }
            index
        };
        let mut index = pattern(&self.ud) * 35 + pattern(&self.fb);
        index *= 12;
        let check = self.fb[7] ^ self.ud[7];
        let mut rl_index = 0;
        let mut r = 4;
        for i in (0..8).rev() {
            if self.rl[i] != check {
                rl_index += cnk(i, r);
                r -= 1;
            }
        }
        let std2rl = RL2STD
            .iter()
            .position(|&s| s as i32 == rl_index)
            .expect("valid rl pattern") as i32;
        (self.parity + 2 * (index + std2rl)) as usize
    }

    fn set_index(&mut self, index: usize) {
        self.parity = (index & 1) as i32;
        let mut index = (index >> 1) as i32;
        let mut rl_index = RL2STD[(index % 12) as usize] as i32;
        index /= 12;
        let mut r = 4;
        for i in (0..8).rev() {
            self.rl[i] = 0;
            if rl_index >= cnk(i, r) {
                rl_index -= cnk(i, r);
                r -= 1;
                self.rl[i] = 1;
            }
        }
        let fb_index = index % 35;
        index /= 35;
        let decode = |side: &mut [i32; 8], mut value: i32| {
            let mut r = 4;
            side[7] = 0;
            for i in (0..7).rev() {
                if value >= cnk(i, r) {
                    value -= cnk(i, r);
                    r -= 1;
                    side[i] = 1;
                } else {
                    side[i] = 0;
                }
            }
        };
        decode(&mut self.fb, fb_index);
        decode(&mut self.ud, index);
    }

    fn do_move(&mut self, i: usize) {
        self.parity ^= PMOVE[i];
        let (ud, rl, fb) = (&mut self.ud, &mut self.rl, &mut self.fb);
        match i {
            0..=2 => swap4(ud, 0, 1, 2, 3, i % 3),
            3 => swap4(rl, 0, 1, 2, 3, 1),
            4..=6 => swap4(fb, 0, 1, 2, 3, (i - 1) % 3),
            7..=9 => swap4(ud, 4, 5, 6, 7, (i - 1) % 3),
            10 => swap4(rl, 4, 5, 6, 7, 1),
            11..=13 => swap4(fb, 4, 5, 6, 7, (i + 1) % 3),
            14 => {
                swap4(ud, 0, 1, 2, 3, 1);
                swap4(rl, 0, 5, 4, 1, 1);
                swap4(fb, 0, 5, 4, 1, 1);
            }
            15 => {
                swap4(rl, 0, 1, 2, 3, 1);
                swap4(fb, 1, 4, 7, 2, 1);
                swap4(ud, 1, 6, 5, 2, 1);
            }
            16 => {
                swap4(fb, 0, 1, 2, 3, 1);
                swap4(ud, 3, 2, 5, 4, 1);
                swap4(rl, 0, 3, 6, 5, 1);
            }
            17 => {
                swap4(ud, 4, 5, 6, 7, 1);
                swap4(rl, 3, 2, 7, 6, 1);
                swap4(fb, 3, 2, 7, 6, 1);
            }
            18 => {
                swap4(rl, 4, 5, 6, 7, 1);
                swap4(fb, 0, 3, 6, 5, 1);
                swap4(ud, 0, 3, 4, 7, 1);
            }
            _ => {
                swap4(fb, 4, 5, 6, 7, 1);
                swap4(ud, 0, 7, 6, 1, 1);
                swap4(rl, 1, 4, 7, 2, 1);
            }
        }
    }
}

pub struct Tables {
    pub ctmove: Vec<[u16; 20]>,
    pub prun: Vec<i8>,
}

pub fn tables() -> &'static Tables {
    static TABLES: OnceLock<Tables> = OnceLock::new();
    TABLES.get_or_init(|| {
        let mut c = Center3::default();
        let ctmove: Vec<[u16; 20]> = (0..N_STATES)
            .map(|i| {
                std::array::from_fn(|m| {
                    c.set_index(i);
                    c.do_move(m);
                    c.index() as u16
                })
            })
            .collect();
        let mut prun = vec![-1i8; N_STATES];
        prun[0] = 0;
        let mut depth = 0i8;
        let mut done = 1;
        while done != 29400 {
            for i in 0..29400 {
                if prun[i] != depth {
                    continue;
                }
                for m in 0..17 {
                    let next = usize::from(ctmove[i][m]);
                    if prun[next] == -1 {
                        prun[next] = depth + 1;
                        done += 1;
                    }
                }
            }
            depth += 1;
        }
        Tables { ctmove, prun }
    })
}
