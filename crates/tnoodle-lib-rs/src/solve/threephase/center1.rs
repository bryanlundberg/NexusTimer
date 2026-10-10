use std::sync::OnceLock;

use super::cubes::{CENTER_FACES, CenterCube};
use super::moves::{BX3, DX2, DX3, FX1, LX3, RX1, UX1, UX2, cnk, swap4};

const N_RAW: usize = 735471;
pub const N_SYM: usize = 15582;

#[derive(Clone, Copy, PartialEq, Eq)]
pub struct Center1 {
    ct: [u8; 24],
}

impl Center1 {
    fn initial() -> Center1 {
        let mut ct = [0u8; 24];
        ct[..8].fill(1);
        Center1 { ct }
    }

    pub fn from_center(cube: &CenterCube, urf: u8) -> Center1 {
        Center1 {
            ct: cube.ct.map(|c| u8::from(c % 3 == urf)),
        }
    }

    fn do_move(&mut self, m: usize) {
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

    fn set(&mut self, mut index: i32) {
        let mut r = 8;
        for i in (0..24).rev() {
            self.ct[i] = 0;
            if index >= cnk(i, r) {
                index -= cnk(i, r);
                r -= 1;
                self.ct[i] = 1;
            }
        }
    }

    fn get(&self) -> i32 {
        let mut index = 0;
        let mut r = 8;
        for i in (0..24).rev() {
            if self.ct[i] == 1 {
                index += cnk(i, r);
                r -= 1;
            }
        }
        index
    }

    fn rot(&mut self, r: usize) {
        match r {
            0 => {
                self.do_move(UX2);
                self.do_move(DX2);
            }
            1 => {
                self.do_move(RX1);
                self.do_move(LX3);
            }
            2 => {
                let ct = &mut self.ct;
                swap4(ct, 0, 3, 1, 2, 1);
                swap4(ct, 8, 11, 9, 10, 1);
                swap4(ct, 4, 7, 5, 6, 1);
                swap4(ct, 12, 15, 13, 14, 1);
                swap4(ct, 16, 19, 21, 22, 1);
                swap4(ct, 17, 18, 20, 23, 1);
            }
            _ => {
                self.do_move(UX1);
                self.do_move(DX3);
                self.do_move(FX1);
                self.do_move(BX3);
            }
        }
    }

    fn step(&mut self, j: usize) {
        self.rot(0);
        if j % 2 == 1 {
            self.rot(1);
        }
        if j % 8 == 7 {
            self.rot(2);
        }
        if j % 16 == 15 {
            self.rot(3);
        }
    }

    fn rotate(&mut self, r: usize) {
        for j in 0..r {
            self.step(j);
        }
    }

    pub fn sym(mut self) -> i32 {
        let t = tables();
        for j in 0..48 {
            if let Ok(class) = t.sym2raw.binary_search(&self.get()) {
                return class as i32 * 64 + j as i32;
            }
            self.step(j);
        }
        unreachable!("every center state has a symmetric representative")
    }

    pub fn solved_sym(cube: &CenterCube) -> usize {
        let mut c = Center1 { ct: cube.ct };
        for j in 0..48 {
            if c.ct == CENTER_FACES {
                return j;
            }
            c.step(j);
        }
        unreachable!("centers are solved before the final orientation is read")
    }
}

pub struct Tables {
    pub ctsmv: Vec<[i32; 36]>,
    pub sym2raw: Vec<i32>,
    pub csprun: Vec<i8>,
    pub symmult: [[usize; 48]; 48],
    pub symmove: [[usize; 36]; 48],
    pub syminv: [usize; 48],
    pub finish: [i32; 48],
}

pub fn tables() -> &'static Tables {
    static TABLES: OnceLock<Tables> = OnceLock::new();
    TABLES.get_or_init(|| {
        let identity = Center1 {
            ct: std::array::from_fn(|i| i as u8),
        };
        let mut symmult = [[0usize; 48]; 48];
        let mut syminv = [0usize; 48];
        let mut c = identity;
        let mut d = identity;
        for i in 0..48 {
            for j in 0..48 {
                for k in 0..48 {
                    if c == d {
                        symmult[i][j] = k;
                        if k == 0 {
                            syminv[i] = j;
                        }
                    }
                    d.step(k);
                }
                c.step(j);
            }
            c.step(i);
        }

        let mut symmove = [[0usize; 36]; 48];
        for i in 0..48 {
            let mut base = identity;
            base.rotate(syminv[i]);
            for j in 0..36 {
                let mut d = base;
                d.do_move(j);
                d.rotate(i);
                symmove[i][j] = (0..36)
                    .find(|&k| {
                        let mut f = identity;
                        f.do_move(k);
                        f == d
                    })
                    .expect("symmetries map moves to moves");
            }
        }

        let mut finish = [0i32; 48];
        let mut c = Center1::initial();
        c.set(0);
        for i in 0..48 {
            finish[syminv[i]] = c.get();
            c.step(i);
        }

        let mut raw2sym = vec![0i32; N_RAW];
        let mut occupied = vec![false; N_RAW];
        let mut sym2raw = Vec::with_capacity(N_SYM);
        let mut c = Center1::initial();
        for i in 0..N_RAW {
            if occupied[i] {
                continue;
            }
            c.set(i as i32);
            let count = sym2raw.len() as i32;
            for j in 0..48 {
                let index = c.get() as usize;
                occupied[index] = true;
                raw2sym[index] = count << 6 | syminv[j] as i32;
                c.step(j);
            }
            sym2raw.push(i as i32);
        }
        assert_eq!(sym2raw.len(), N_SYM);

        let ctsmv: Vec<[i32; 36]> = sym2raw
            .iter()
            .map(|&raw| {
                let mut d = Center1::initial();
                d.set(raw);
                std::array::from_fn(|m| {
                    let mut c = d;
                    c.do_move(m);
                    raw2sym[c.get() as usize]
                })
            })
            .collect();
        drop(raw2sym);

        let mut csprun = vec![-1i8; N_SYM];
        csprun[0] = 0;
        let mut depth = 0i8;
        let mut done = 1;
        while done != N_SYM {
            let inverse = depth > 4;
            let select = if inverse { -1 } else { depth };
            let check = if inverse { depth } else { -1 };
            depth += 1;
            for i in 0..N_SYM {
                if csprun[i] != select {
                    continue;
                }
                for m in 0..27 {
                    let index = (ctsmv[i][m] >> 6) as usize;
                    if csprun[index] != check {
                        continue;
                    }
                    done += 1;
                    if inverse {
                        csprun[i] = depth;
                        break;
                    }
                    csprun[index] = depth;
                }
            }
        }

        Tables {
            ctsmv,
            sym2raw,
            csprun,
            symmult,
            symmove,
            syminv,
            finish,
        }
    })
}
