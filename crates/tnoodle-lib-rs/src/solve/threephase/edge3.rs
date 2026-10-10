use std::sync::OnceLock;

use super::cubes::EdgeCube;

pub const N_SYM: usize = 1538;
pub const N_RAW: usize = 20160;
pub const N_EPRUN: usize = N_SYM * N_RAW;
pub const MAX_DEPTH: i32 = 10;
const SYMINV: [usize; 8] = [0, 1, 6, 3, 4, 5, 2, 7];
const FACT_X: [i64; 13] = [
    1, 1, 1, 3, 12, 60, 360, 2520, 20160, 181440, 1814400, 19958400, 239500800,
];
const FULL_EDGE_MAP: [usize; 12] = [0, 2, 4, 6, 1, 3, 7, 5, 8, 9, 10, 11];
const IDENTITY: [i32; 12] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

#[derive(Clone, Copy)]
pub struct Edge3 {
    pub edge: [i32; 12],
    edgeo: [i32; 12],
    temp: [i32; 12],
    is_std: bool,
}

impl Default for Edge3 {
    fn default() -> Edge3 {
        Edge3 {
            edge: IDENTITY,
            edgeo: IDENTITY,
            temp: IDENTITY,
            is_std: true,
        }
    }
}

impl Edge3 {
    pub fn set_cube(&mut self, cube: &EdgeCube) -> i32 {
        self.temp = IDENTITY;
        for i in 0..12 {
            self.edge[i] = i32::from(cube.ep[FULL_EDGE_MAP[i] + 12] % 12);
        }
        let mut parity = 1;
        for i in 0..12 {
            while self.edge[i] != i as i32 {
                let t = self.edge[i] as usize;
                self.edge[i] = self.edge[t];
                self.edge[t] = t as i32;
                self.temp.swap(i, t);
                parity ^= 1;
            }
        }
        for i in 0..12 {
            self.edge[i] = self.temp[usize::from(cube.ep[FULL_EDGE_MAP[i]] % 12)];
        }
        self.edgeo = IDENTITY;
        self.is_std = true;
        parity
    }

    fn std(&mut self) {
        for i in 0..12 {
            self.temp[self.edgeo[i] as usize] = i as i32;
        }
        for i in 0..12 {
            self.edge[i] = self.temp[self.edge[i] as usize];
            self.edgeo[i] = i as i32;
        }
        self.is_std = true;
    }

    pub fn get(&mut self, end: usize) -> usize {
        if !self.is_std {
            self.std();
        }
        let mut index: u64 = 0;
        let mut val: u64 = 0xba9876543210;
        for i in 0..end {
            let v = (self.edge[i] as u64) << 2;
            index *= 12 - i as u64;
            index += (val >> v) & 0xf;
            val = val.wrapping_sub(0x111111111110u64 << v);
        }
        index as usize
    }

    pub fn set_index(&mut self, index: usize) {
        let mut index = index as i64;
        let mut val: u64 = 0xba9876543210;
        let mut parity = 0;
        for i in 0..11 {
            let p = FACT_X[11 - i];
            let mut v = index / p;
            index %= p;
            parity ^= v;
            v <<= 2;
            self.edge[i] = ((val >> v) & 0xf) as i32;
            let mask = (1u64 << v) - 1;
            val = (val & mask) + ((val >> 4) & !mask);
        }
        if parity & 1 == 0 {
            self.edge[11] = val as i32;
        } else {
            self.edge[11] = self.edge[10];
            self.edge[10] = val as i32;
        }
        self.edgeo = IDENTITY;
        self.is_std = true;
    }

    fn circle(arr: &mut [i32; 12], a: usize, b: usize, c: usize, d: usize) {
        let t = arr[d];
        arr[d] = arr[c];
        arr[c] = arr[b];
        arr[b] = arr[a];
        arr[a] = t;
    }

    fn swap(arr: &mut [i32; 12], a: usize, b: usize, c: usize, d: usize) {
        arr.swap(a, c);
        arr.swap(b, d);
    }

    pub fn do_move(&mut self, i: usize) {
        self.is_std = false;
        let both = |e: &mut Edge3, f: fn(&mut [i32; 12], usize, usize, usize, usize), a, b, c, d| {
            f(&mut e.edge, a, b, c, d);
            f(&mut e.edgeo, a, b, c, d);
        };
        match i {
            0 => both(self, Edge3::circle, 0, 4, 1, 5),
            1 => both(self, Edge3::swap, 0, 4, 1, 5),
            2 => both(self, Edge3::circle, 0, 5, 1, 4),
            3 => both(self, Edge3::swap, 5, 10, 6, 11),
            4 => both(self, Edge3::circle, 0, 11, 3, 8),
            5 => both(self, Edge3::swap, 0, 11, 3, 8),
            6 => both(self, Edge3::circle, 0, 8, 3, 11),
            7 => both(self, Edge3::circle, 2, 7, 3, 6),
            8 => both(self, Edge3::swap, 2, 7, 3, 6),
            9 => both(self, Edge3::circle, 2, 6, 3, 7),
            10 => both(self, Edge3::swap, 4, 8, 7, 9),
            11 => both(self, Edge3::circle, 1, 9, 2, 10),
            12 => both(self, Edge3::swap, 1, 9, 2, 10),
            13 => both(self, Edge3::circle, 1, 10, 2, 9),
            14 => {
                both(self, Edge3::swap, 0, 4, 1, 5);
                self.edge.swap(9, 11);
                self.edgeo.swap(8, 10);
            }
            15 => {
                both(self, Edge3::swap, 5, 10, 6, 11);
                self.edge.swap(1, 3);
                self.edgeo.swap(0, 2);
            }
            16 => {
                both(self, Edge3::swap, 0, 11, 3, 8);
                self.edge.swap(5, 7);
                self.edgeo.swap(4, 6);
            }
            17 => {
                both(self, Edge3::swap, 2, 7, 3, 6);
                self.edge.swap(8, 10);
                self.edgeo.swap(9, 11);
            }
            18 => {
                both(self, Edge3::swap, 4, 8, 7, 9);
                self.edge.swap(0, 2);
                self.edgeo.swap(1, 3);
            }
            _ => {
                both(self, Edge3::swap, 1, 9, 2, 10);
                self.edge.swap(4, 6);
                self.edgeo.swap(5, 7);
            }
        }
    }

    fn swapx(&mut self, x: usize, y: usize) {
        std::mem::swap(&mut self.edge[x], &mut self.edgeo[y]);
    }

    fn circlex(&mut self, a: usize, b: usize, c: usize, d: usize) {
        let t = self.edgeo[d];
        self.edgeo[d] = self.edge[c];
        self.edge[c] = self.edgeo[b];
        self.edgeo[b] = self.edge[a];
        self.edge[a] = t;
    }

    fn rot(&mut self, r: usize) {
        self.is_std = false;
        match r {
            0 => {
                self.do_move(14);
                self.do_move(17);
            }
            1 => {
                self.circlex(11, 5, 10, 6);
                self.circlex(5, 10, 6, 11);
                self.circlex(1, 2, 3, 0);
                self.circlex(4, 9, 7, 8);
                self.circlex(8, 4, 9, 7);
                self.circlex(0, 1, 2, 3);
            }
            _ => {
                for (x, y) in [
                    (4, 5),
                    (5, 4),
                    (11, 8),
                    (8, 11),
                    (7, 6),
                    (6, 7),
                    (9, 10),
                    (10, 9),
                    (1, 1),
                    (0, 0),
                    (3, 3),
                    (2, 2),
                ] {
                    self.swapx(x, y);
                }
            }
        }
    }

    pub fn rotate(&mut self, mut r: usize) {
        while r >= 2 {
            r -= 2;
            self.rot(1);
            self.rot(2);
        }
        if r != 0 {
            self.rot(0);
        }
    }

    pub fn sym(&mut self) -> usize {
        let t = tables();
        let packed = t.raw2sym[self.get(4)];
        self.rotate(packed & 0x7);
        (packed >> 3) * N_RAW + self.get(10) % N_RAW
    }
}

pub struct Tables {
    mvrot: Vec<[i32; 12]>,
    mvroto: Vec<[i32; 12]>,
    eprun: Vec<u32>,
    sym2raw: Vec<usize>,
    symstate: Vec<u16>,
    pub raw2sym: Vec<usize>,
}

impl Tables {
    pub fn mvrot(&self, ep: &[i32; 12], mr: usize, end: usize) -> usize {
        let movo = &self.mvroto[mr];
        let mov = &self.mvrot[mr];
        let mut index: u64 = 0;
        let mut val: u64 = 0xba9876543210;
        for i in 0..end {
            let v = (movo[ep[mov[i] as usize] as usize] as u64) << 2;
            index *= 12 - i as u64;
            index += (val >> v) & 0xf;
            val = val.wrapping_sub(0x111111111110u64 << v);
        }
        index as usize
    }

    fn pruning(&self, index: usize) -> u32 {
        (self.eprun[index >> 4] >> ((index & 0xf) << 1)) & 0x3
    }

    pub fn prun_from(&self, edge: usize, parent: i32) -> i32 {
        let depm3 = self.pruning(edge) as i32;
        if depm3 == 0x3 {
            return MAX_DEPTH;
        }
        (depm3 - parent + 16) % 3 + parent - 1
    }

    pub fn prun(&self, mut edge: usize) -> i32 {
        let mut e = Edge3::default();
        let mut depth = 0;
        let mut depm3 = self.pruning(edge);
        if depm3 == 0x3 {
            return MAX_DEPTH;
        }
        while edge != 0 {
            depm3 = if depm3 == 0 { 2 } else { depm3 - 1 };
            let cord1 = self.sym2raw[edge / N_RAW];
            let cord2 = edge % N_RAW;
            e.set_index(cord1 * N_RAW + cord2);
            for m in 0..17 {
                let packed = self.raw2sym[self.mvrot(&e.edge, m << 3, 4)];
                let symx = packed & 0x7;
                let cord2x = self.mvrot(&e.edge, m << 3 | symx, 10) % N_RAW;
                let index = (packed >> 3) * N_RAW + cord2x;
                if self.pruning(index) == depm3 {
                    depth += 1;
                    edge = index;
                    break;
                }
            }
        }
        depth
    }
}

fn set_pruning(table: &mut [u32], index: usize, value: u32) {
    table[index >> 4] ^= (0x3 ^ value) << ((index & 0xf) << 1);
}

fn get_pruning(table: &[u32], index: usize) -> u32 {
    (table[index >> 4] >> ((index & 0xf) << 1)) & 0x3
}

pub fn tables() -> &'static Tables {
    static TABLES: OnceLock<Tables> = OnceLock::new();
    TABLES.get_or_init(|| {
        let mut mvrot = vec![[0i32; 12]; 160];
        let mut mvroto = vec![[0i32; 12]; 160];
        let mut e = Edge3::default();
        for m in 0..20 {
            for r in 0..8 {
                e.set_index(0);
                e.do_move(m);
                e.rotate(r);
                mvrot[m << 3 | r] = e.edge;
                e.std();
                mvroto[m << 3 | r] = e.temp;
            }
        }

        let mut sym2raw = Vec::with_capacity(N_SYM);
        let mut symstate = Vec::with_capacity(N_SYM);
        let mut raw2sym = vec![0usize; 11880];
        let mut occupied = vec![false; 11880];
        for i in 0..11880 {
            if occupied[i] {
                continue;
            }
            let count = sym2raw.len();
            let mut state = 0u16;
            e.set_index(i * N_RAW);
            for j in 0..8 {
                let index = e.get(4);
                if index == i {
                    state |= 1 << j;
                }
                occupied[index] = true;
                raw2sym[index] = count << 3 | SYMINV[j];
                e.rot(0);
                if j % 2 == 1 {
                    e.rot(1);
                    e.rot(2);
                }
            }
            sym2raw.push(i);
            symstate.push(state);
        }
        assert_eq!(sym2raw.len(), N_SYM);

        let mut tables = Tables {
            mvrot,
            mvroto,
            eprun: vec![u32::MAX; N_EPRUN / 16],
            sym2raw,
            symstate,
            raw2sym,
        };
        let mut eprun = std::mem::take(&mut tables.eprun);
        set_pruning(&mut eprun, 0, 0);
        let mut depth = 0;
        let mut done = 1usize;
        while done != N_EPRUN && depth < MAX_DEPTH - 1 {
            let depm3 = (depth % 3) as u32;
            let dep1m3 = ((depth + 1) % 3) as u32;
            for block in (0..N_EPRUN).step_by(16) {
                let mut val = eprun[block >> 4];
                if val == u32::MAX {
                    continue;
                }
                for i in block..block + 16 {
                    let current = val & 0x3;
                    val >>= 2;
                    if current != depm3 {
                        continue;
                    }
                    let cord1 = tables.sym2raw[i / N_RAW];
                    e.set_index(cord1 * N_RAW + i % N_RAW);
                    for m in 0..17 {
                        let packed = tables.raw2sym[tables.mvrot(&e.edge, m << 3, 4)];
                        let symx = packed & 0x7;
                        let symcord1x = packed >> 3;
                        let cord2x = tables.mvrot(&e.edge, m << 3 | symx, 10) % N_RAW;
                        let index = symcord1x * N_RAW + cord2x;
                        if get_pruning(&eprun, index) != 0x3 {
                            continue;
                        }
                        set_pruning(&mut eprun, index, dep1m3);
                        done += 1;
                        let mut sym_state = tables.symstate[symcord1x];
                        if sym_state == 1 {
                            continue;
                        }
                        let mut f = e;
                        f.do_move(m);
                        f.rotate(symx);
                        let mut j = 1;
                        loop {
                            sym_state >>= 1;
                            if sym_state == 0 {
                                break;
                            }
                            if sym_state & 1 == 1 {
                                let mut g = f;
                                g.rotate(j);
                                let variant = symcord1x * N_RAW + g.get(10) % N_RAW;
                                if get_pruning(&eprun, variant) == 0x3 {
                                    set_pruning(&mut eprun, variant, dep1m3);
                                    done += 1;
                                }
                            }
                            j += 1;
                        }
                    }
                }
            }
            depth += 1;
        }
        tables.eprun = eprun;
        tables
    })
}
