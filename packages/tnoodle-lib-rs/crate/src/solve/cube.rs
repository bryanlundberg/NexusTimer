use crate::random::Rng;

pub const N_MOVES: usize = 18;
pub const MOVE_NAMES: [&str; N_MOVES] = [
    "U", "U2", "U'", "R", "R2", "R'", "F", "F2", "F'", "D", "D2", "D'", "L", "L2", "L'", "B", "B2", "B'",
];

const CORNER_FACELETS: [[usize; 3]; 8] = [
    [8, 9, 20],
    [6, 18, 38],
    [0, 36, 47],
    [2, 45, 11],
    [29, 26, 15],
    [27, 44, 24],
    [33, 53, 42],
    [35, 17, 51],
];
const EDGE_FACELETS: [[usize; 2]; 12] = [
    [5, 10],
    [7, 19],
    [3, 37],
    [1, 46],
    [32, 16],
    [28, 25],
    [30, 43],
    [34, 52],
    [23, 12],
    [21, 41],
    [50, 39],
    [48, 14],
];
const CORNER_COLORS: [[u8; 3]; 8] = [
    [0, 1, 2],
    [0, 2, 4],
    [0, 4, 5],
    [0, 5, 1],
    [3, 2, 1],
    [3, 4, 2],
    [3, 5, 4],
    [3, 1, 5],
];
const EDGE_COLORS: [[u8; 2]; 12] = [
    [0, 1],
    [0, 2],
    [0, 4],
    [0, 5],
    [3, 1],
    [3, 2],
    [3, 4],
    [3, 5],
    [2, 1],
    [2, 4],
    [5, 4],
    [5, 1],
];

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct CubieCube {
    pub cp: [u8; 8],
    pub co: [u8; 8],
    pub ep: [u8; 12],
    pub eo: [u8; 12],
}

const FACE_TURNS: [CubieCube; 6] = [
    CubieCube {
        cp: [3, 0, 1, 2, 4, 5, 6, 7],
        co: [0; 8],
        ep: [3, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11],
        eo: [0; 12],
    },
    CubieCube {
        cp: [4, 1, 2, 0, 7, 5, 6, 3],
        co: [2, 0, 0, 1, 1, 0, 0, 2],
        ep: [8, 1, 2, 3, 11, 5, 6, 7, 4, 9, 10, 0],
        eo: [0; 12],
    },
    CubieCube {
        cp: [1, 5, 2, 3, 0, 4, 6, 7],
        co: [1, 2, 0, 0, 2, 1, 0, 0],
        ep: [0, 9, 2, 3, 4, 8, 6, 7, 1, 5, 10, 11],
        eo: [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],
    },
    CubieCube {
        cp: [0, 1, 2, 3, 5, 6, 7, 4],
        co: [0; 8],
        ep: [0, 1, 2, 3, 5, 6, 7, 4, 8, 9, 10, 11],
        eo: [0; 12],
    },
    CubieCube {
        cp: [0, 2, 6, 3, 4, 1, 5, 7],
        co: [0, 1, 2, 0, 0, 2, 1, 0],
        ep: [0, 1, 10, 3, 4, 5, 9, 7, 8, 2, 6, 11],
        eo: [0; 12],
    },
    CubieCube {
        cp: [0, 1, 3, 7, 4, 5, 2, 6],
        co: [0, 0, 1, 2, 0, 0, 2, 1],
        ep: [0, 1, 2, 11, 4, 5, 6, 10, 8, 9, 3, 7],
        eo: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
    },
];

const FACTORIAL: [u32; 13] = [
    1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600,
];

pub fn rank_perm(perm: &[u8]) -> usize {
    let n = perm.len();
    (0..n)
        .map(|i| perm[i + 1..].iter().filter(|&&p| p < perm[i]).count() * FACTORIAL[n - 1 - i] as usize)
        .sum()
}

pub fn unrank_perm(mut index: usize, perm: &mut [u8]) {
    let n = perm.len();
    let mut remaining = [0u8, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    for i in 0..n {
        let f = FACTORIAL[n - 1 - i] as usize;
        let pick = index / f;
        index %= f;
        perm[i] = remaining[pick];
        remaining.copy_within(pick + 1..n - i, pick);
    }
}

pub fn parity(perm: &[u8]) -> u8 {
    let mut parity = 0;
    for i in 0..perm.len() {
        for j in i + 1..perm.len() {
            if perm[j] < perm[i] {
                parity ^= 1;
            }
        }
    }
    parity
}

impl CubieCube {
    pub const SOLVED: CubieCube = CubieCube {
        cp: [0, 1, 2, 3, 4, 5, 6, 7],
        co: [0; 8],
        ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        eo: [0; 12],
    };

    pub fn multiply(&self, other: &CubieCube) -> CubieCube {
        let mut result = CubieCube::SOLVED;
        for i in 0..8 {
            let from = usize::from(other.cp[i]);
            result.cp[i] = self.cp[from];
            result.co[i] = (self.co[from] + other.co[i]) % 3;
        }
        for i in 0..12 {
            let from = usize::from(other.ep[i]);
            result.ep[i] = self.ep[from];
            result.eo[i] = (self.eo[from] + other.eo[i]) % 2;
        }
        result
    }

    pub fn apply_move(&self, mv: usize) -> CubieCube {
        let turn = &FACE_TURNS[mv / 3];
        let mut cube = self.multiply(turn);
        for _ in 0..mv % 3 {
            cube = cube.multiply(turn);
        }
        cube
    }

    #[cfg(test)]
    pub fn apply_moves(&self, moves: &[usize]) -> CubieCube {
        moves.iter().fold(*self, |cube, &mv| cube.apply_move(mv))
    }

    pub fn random(rng: &mut Rng) -> CubieCube {
        let mut cube = CubieCube::SOLVED;
        unrank_perm(rng.below_usize(40320), &mut cube.cp);
        loop {
            unrank_perm(rng.below_usize(479001600), &mut cube.ep);
            if parity(&cube.ep) == parity(&cube.cp) {
                break;
            }
        }
        let mut twist = rng.below_usize(2187);
        let mut twist_sum = 0;
        for co in cube.co[..7].iter_mut().rev() {
            *co = (twist % 3) as u8;
            twist_sum += *co;
            twist /= 3;
        }
        cube.co[7] = (3 - twist_sum % 3) % 3;
        let mut flip = rng.below_usize(2048);
        let mut flip_sum = 0;
        for eo in cube.eo[..11].iter_mut().rev() {
            *eo = (flip % 2) as u8;
            flip_sum += *eo;
            flip /= 2;
        }
        cube.eo[11] = flip_sum % 2;
        cube
    }

    pub fn inverse(&self) -> CubieCube {
        let mut result = CubieCube::SOLVED;
        for i in 0..8 {
            let piece = usize::from(self.cp[i]);
            result.cp[piece] = i as u8;
            result.co[piece] = (3 - self.co[i]) % 3;
        }
        for i in 0..12 {
            let piece = usize::from(self.ep[i]);
            result.ep[piece] = i as u8;
            result.eo[piece] = self.eo[i];
        }
        result
    }

    pub fn is_solved(&self) -> bool {
        *self == CubieCube::SOLVED
    }

    pub fn within_one_move(&self) -> bool {
        self.is_solved() || (0..N_MOVES).any(|mv| self.apply_move(mv).is_solved())
    }

    #[cfg(any(test, feature = "oracle"))]
    pub fn facelets(&self) -> String {
        let mut facelets = *b"UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
        for i in 0..8 {
            let piece = usize::from(self.cp[i]);
            let twist = usize::from(self.co[i]);
            for n in 0..3 {
                facelets[CORNER_FACELETS[i][(n + twist) % 3]] = b"URFDLB"[usize::from(CORNER_COLORS[piece][n])];
            }
        }
        for i in 0..12 {
            let piece = usize::from(self.ep[i]);
            let flip = usize::from(self.eo[i]);
            for n in 0..2 {
                facelets[EDGE_FACELETS[i][(n + flip) % 2]] = b"URFDLB"[usize::from(EDGE_COLORS[piece][n])];
            }
        }
        String::from_utf8(facelets.to_vec()).unwrap()
    }

    pub fn from_facelets(facelets: &[u8; 54]) -> Option<CubieCube> {
        let mut face_of = [u8::MAX; 256];
        for face in 0..6 {
            face_of[usize::from(facelets[4 + face * 9])] = face as u8;
        }
        let face = |index: usize| face_of[usize::from(facelets[index])];
        let mut cube = CubieCube::SOLVED;
        for i in 0..8 {
            let twist = (0..3).find(|&o| matches!(face(CORNER_FACELETS[i][o]), 0 | 3))?;
            let (a, b) = (
                face(CORNER_FACELETS[i][(twist + 1) % 3]),
                face(CORNER_FACELETS[i][(twist + 2) % 3]),
            );
            cube.cp[i] = CORNER_COLORS.iter().position(|c| c[1] == a && c[2] == b)? as u8;
            cube.co[i] = twist as u8;
        }
        for i in 0..12 {
            let (a, b) = (face(EDGE_FACELETS[i][0]), face(EDGE_FACELETS[i][1]));
            if let Some(piece) = EDGE_COLORS.iter().position(|c| c[0] == a && c[1] == b) {
                cube.ep[i] = piece as u8;
                cube.eo[i] = 0;
            } else {
                cube.ep[i] = EDGE_COLORS.iter().position(|c| c[0] == b && c[1] == a)? as u8;
                cube.eo[i] = 1;
            }
        }
        Some(cube)
    }
}

pub fn invert_moves(moves: &[usize]) -> Vec<usize> {
    moves.iter().rev().map(|&mv| mv / 3 * 3 + 2 - mv % 3).collect()
}

pub fn moves_to_string(moves: &[usize]) -> String {
    moves.iter().map(|&mv| MOVE_NAMES[mv]).collect::<Vec<_>>().join(" ")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn four_quarter_turns_are_identity() {
        for face in 0..6 {
            let cube = (0..4).fold(CubieCube::SOLVED, |c, _| c.apply_move(face * 3));
            assert!(cube.is_solved());
        }
    }

    #[test]
    fn sexy_move_has_order_six() {
        let sexy = [3, 0, 5, 2];
        let cube = (0..6).fold(CubieCube::SOLVED, |c, _| c.apply_moves(&sexy));
        assert!(cube.is_solved());
        assert!(!CubieCube::SOLVED.apply_moves(&sexy).is_solved());
    }

    #[test]
    fn facelets_of_a_known_state() {
        assert_eq!(
            CubieCube::SOLVED.facelets(),
            "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
        );
        assert_eq!(
            CubieCube::SOLVED.apply_move(3).facelets(),
            "UUFUUFUUFRRRRRRRRRFFDFFDFFDDDBDDBDDBLLLLLLLLLUBBUBBUBB"
        );
    }

    #[test]
    fn facelets_round_trip() {
        let mut rng = Rng::seeded(4);
        for _ in 0..200 {
            let cube = CubieCube::random(&mut rng);
            let facelets: [u8; 54] = cube.facelets().into_bytes().try_into().unwrap();
            assert_eq!(CubieCube::from_facelets(&facelets), Some(cube));
        }
    }

    #[test]
    fn random_cubes_are_valid() {
        let mut rng = Rng::seeded(1);
        for _ in 0..1000 {
            let cube = CubieCube::random(&mut rng);
            assert_eq!(cube.co.iter().map(|&c| u32::from(c)).sum::<u32>() % 3, 0);
            assert_eq!(cube.eo.iter().map(|&e| u32::from(e)).sum::<u32>() % 2, 0);
            assert_eq!(parity(&cube.cp), parity(&cube.ep));
        }
    }
}
