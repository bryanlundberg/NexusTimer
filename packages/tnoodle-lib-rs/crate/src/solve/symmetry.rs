use std::sync::OnceLock;

use super::cube::CubieCube;

const ROTATE_F2: CubieCube = CubieCube {
    cp: [5, 4, 7, 6, 1, 0, 3, 2],
    co: [0; 8],
    ep: [6, 5, 4, 7, 2, 1, 0, 3, 9, 8, 11, 10],
    eo: [0; 12],
};

const ROTATE_U4: CubieCube = CubieCube {
    cp: [3, 0, 1, 2, 7, 4, 5, 6],
    co: [0; 8],
    ep: [3, 0, 1, 2, 7, 4, 5, 6, 11, 8, 9, 10],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
};

const MIRROR_LR: CubieCube = CubieCube {
    cp: [1, 0, 3, 2, 5, 4, 7, 6],
    co: [3; 8],
    ep: [2, 1, 0, 3, 6, 5, 4, 7, 9, 8, 11, 10],
    eo: [0; 12],
};

pub fn multiply(a: &CubieCube, b: &CubieCube) -> CubieCube {
    let mut result = CubieCube::SOLVED;
    for i in 0..8 {
        let from = usize::from(b.cp[i]);
        result.cp[i] = a.cp[from];
        let (x, y) = (a.co[from], b.co[i]);
        result.co[i] = match (x < 3, y < 3) {
            (true, true) => (x + y) % 3,
            (true, false) => {
                let o = x + y;
                if o >= 6 { o - 3 } else { o }
            }
            (false, true) => {
                let o = x - y;
                if o < 3 { o + 3 } else { o }
            }
            (false, false) => (x + 3 - y) % 3,
        };
    }
    for i in 0..12 {
        let from = usize::from(b.ep[i]);
        result.ep[i] = a.ep[from];
        result.eo[i] = (a.eo[from] + b.eo[i]) % 2;
    }
    result
}

fn inverse(cube: &CubieCube) -> CubieCube {
    let mut result = CubieCube::SOLVED;
    for i in 0..8 {
        result.cp[usize::from(cube.cp[i])] = i as u8;
    }
    for c in 0..8 {
        let twist = cube.co[usize::from(result.cp[c])];
        result.co[c] = if twist >= 3 { twist } else { (3 - twist) % 3 };
    }
    for i in 0..12 {
        let piece = usize::from(cube.ep[i]);
        result.ep[piece] = i as u8;
        result.eo[piece] = cube.eo[i];
    }
    result
}

pub struct Symmetries {
    pub cubes: Vec<CubieCube>,
    pub inverses: Vec<CubieCube>,
    pub inverse_index: Vec<usize>,
    pub edge_safe: Vec<usize>,
}

pub fn ud_symmetries() -> &'static Symmetries {
    static SYMMETRIES: OnceLock<Symmetries> = OnceLock::new();
    SYMMETRIES.get_or_init(|| {
        let mut cubes = vec![CubieCube::SOLVED];
        let mut index = 0;
        while index < cubes.len() {
            for generator in [ROTATE_F2, ROTATE_U4, MIRROR_LR] {
                let product = multiply(&cubes[index], &generator);
                if !cubes.contains(&product) {
                    cubes.push(product);
                }
            }
            index += 1;
        }
        assert_eq!(cubes.len(), 16);
        let inverses: Vec<CubieCube> = cubes.iter().map(inverse).collect();
        let inverse_index = inverses
            .iter()
            .map(|inv| cubes.iter().position(|c| c == inv).expect("group is closed"))
            .collect();
        let edge_safe = (0..16).filter(|&s| cubes[s].eo == [0; 12]).collect();
        Symmetries {
            cubes,
            inverses,
            inverse_index,
            edge_safe,
        }
    })
}

pub fn conjugate(cube: &CubieCube, sym: usize) -> CubieCube {
    let s = ud_symmetries();
    multiply(&multiply(&s.cubes[sym], cube), &s.inverses[sym])
}

pub struct SymCoordinate {
    pub class_of: Vec<u32>,
    pub reps: Vec<u32>,
    pub stabilizers: Vec<u16>,
}

impl SymCoordinate {
    pub fn class(&self, raw: usize) -> (usize, usize) {
        let packed = self.class_of[raw];
        ((packed >> 4) as usize, (packed & 0xf) as usize)
    }
}

pub fn reduce(
    size: usize,
    syms: &[usize],
    set: impl Fn(&mut CubieCube, usize),
    get: impl Fn(&CubieCube) -> usize,
) -> SymCoordinate {
    let s = ud_symmetries();
    let mut class_of = vec![u32::MAX; size];
    let mut reps = Vec::new();
    let mut stabilizers = Vec::new();
    for raw in 0..size {
        if class_of[raw] != u32::MAX {
            continue;
        }
        let class = reps.len() as u32;
        reps.push(raw as u32);
        let mut cube = CubieCube::SOLVED;
        set(&mut cube, raw);
        let mut stabilizer = 0u16;
        for (position, &sym) in syms.iter().enumerate() {
            let image = get(&conjugate(&cube, sym));
            if image == raw {
                stabilizer |= 1 << position;
            }
            if class_of[image] == u32::MAX {
                let back = syms
                    .iter()
                    .position(|&t| t == s.inverse_index[sym])
                    .expect("subgroup is closed");
                class_of[image] = class << 4 | back as u32;
            }
        }
        stabilizers.push(stabilizer);
    }
    SymCoordinate {
        class_of,
        reps,
        stabilizers,
    }
}

pub fn conjugation_table(
    size: usize,
    syms: &[usize],
    set: impl Fn(&mut CubieCube, usize),
    get: impl Fn(&CubieCube) -> usize,
) -> Vec<u16> {
    let mut table = Vec::with_capacity(size * syms.len());
    for raw in 0..size {
        let mut cube = CubieCube::SOLVED;
        set(&mut cube, raw);
        table.extend(syms.iter().map(|&sym| get(&conjugate(&cube, sym)) as u16));
    }
    table
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::solve::cube::{CubieCube, N_MOVES};

    #[test]
    fn forms_the_d4h_group() {
        let s = ud_symmetries();
        assert_eq!(s.cubes[0], CubieCube::SOLVED);
        assert_eq!(s.edge_safe.len(), 8);
        for (i, cube) in s.cubes.iter().enumerate() {
            assert_eq!(multiply(cube, &s.inverses[i]), CubieCube::SOLVED);
        }
    }

    #[test]
    fn conjugation_maps_moves_to_moves() {
        let moves: Vec<CubieCube> = (0..N_MOVES).map(|mv| CubieCube::SOLVED.apply_move(mv)).collect();
        for sym in 0..16 {
            for m in &moves {
                assert!(moves.contains(&conjugate(m, sym)), "symmetry {sym}");
            }
        }
    }
}
