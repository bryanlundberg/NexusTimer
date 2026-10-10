use std::sync::OnceLock;

use super::cube::{CubieCube, N_MOVES, invert_moves, rank_perm, unrank_perm};
use super::sym_distance_table;
use super::symmetry::{self, SymCoordinate};

const N_TWIST: usize = 2187;
const N_FLIP: usize = 2048;
const N_SLICE: usize = 495;
const N_CPERM: usize = 40320;
const N_EPERM: usize = 40320;
const N_SLICE_PERM: usize = 24;
const PHASE2_MOVES: [usize; 10] = [0, 1, 2, 4, 7, 9, 10, 11, 13, 16];
const MAX_PHASE2_LENGTH: usize = 12;

const ROTATE_URF: CubieCube = CubieCube {
    cp: [0, 4, 5, 1, 3, 7, 6, 2],
    co: [1, 2, 1, 2, 2, 1, 2, 1],
    ep: [1, 8, 5, 9, 3, 11, 7, 10, 0, 4, 6, 2],
    eo: [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
};

fn binomial(n: usize, k: usize) -> usize {
    if k > n {
        return 0;
    }
    (0..k).fold(1, |acc, i| acc * (n - i) / (i + 1))
}

fn twist(cube: &CubieCube) -> usize {
    cube.co[..7].iter().fold(0, |acc, &c| acc * 3 + usize::from(c))
}

fn set_twist(cube: &mut CubieCube, mut index: usize) {
    let mut sum = 0;
    for co in cube.co[..7].iter_mut().rev() {
        *co = (index % 3) as u8;
        sum += *co;
        index /= 3;
    }
    cube.co[7] = (3 - sum % 3) % 3;
}

fn flip(cube: &CubieCube) -> usize {
    cube.eo[..11].iter().fold(0, |acc, &e| acc * 2 + usize::from(e))
}

fn set_flip(cube: &mut CubieCube, mut index: usize) {
    let mut sum = 0;
    for eo in cube.eo[..11].iter_mut().rev() {
        *eo = (index % 2) as u8;
        sum += *eo;
        index /= 2;
    }
    cube.eo[11] = sum % 2;
}

fn slice(cube: &CubieCube) -> usize {
    let mut index = 0;
    let mut found = 0;
    for position in (0..12).rev() {
        if cube.ep[position] >= 8 {
            index += binomial(11 - position, found + 1);
            found += 1;
        }
    }
    index
}

fn set_slice(cube: &mut CubieCube, mut index: usize) {
    let mut remaining = 4;
    let mut slice_edge = 8;
    let mut other_edge = 0;
    for position in 0..12 {
        let c = binomial(11 - position, remaining);
        if remaining > 0 && index >= c {
            cube.ep[position] = slice_edge;
            slice_edge += 1;
            index -= c;
            remaining -= 1;
        } else {
            cube.ep[position] = other_edge;
            other_edge += 1;
        }
    }
}

fn set_cperm(cube: &mut CubieCube, index: usize) {
    unrank_perm(index, &mut cube.cp);
}

fn cperm(cube: &CubieCube) -> usize {
    rank_perm(&cube.cp)
}

fn set_eperm(cube: &mut CubieCube, index: usize) {
    unrank_perm(index, &mut cube.ep[..8]);
}

fn eperm(cube: &CubieCube) -> usize {
    rank_perm(&cube.ep[..8])
}

fn set_slice_perm(cube: &mut CubieCube, index: usize) {
    unrank_perm(index, &mut cube.ep[8..]);
    for edge in cube.ep[8..].iter_mut() {
        *edge += 8;
    }
}

fn slice_perm(cube: &CubieCube) -> usize {
    let mut perm = [0u8; 4];
    for (slot, &edge) in perm.iter_mut().zip(&cube.ep[8..]) {
        *slot = edge - 8;
    }
    rank_perm(&perm)
}

struct Tables {
    move_cubes: [CubieCube; N_MOVES],
    rotations: [CubieCube; 3],
    move_map: [[usize; N_MOVES]; 3],
    twist_move: Vec<[u16; N_MOVES]>,
    flip_move: Vec<[u16; N_MOVES]>,
    slice_move: Vec<[u16; N_MOVES]>,
    cperm_move: Vec<[u16; 10]>,
    eperm_move: Vec<[u16; 10]>,
    slice_perm_move: Vec<[u16; 10]>,
    twist_sym: SymCoordinate,
    flip_sym: SymCoordinate,
    cperm_sym: SymCoordinate,
    eperm_sym: SymCoordinate,
    flip_conj: Vec<u16>,
    slice_conj: Vec<u16>,
    slice_perm_conj: Vec<u16>,
    twist_slice_prun: Vec<u8>,
    flip_slice_prun: Vec<u8>,
    twist_flip_prun: Vec<u8>,
    cperm_slice_prun: Vec<u8>,
    eperm_slice_prun: Vec<u8>,
}

const EDGE_SAFE_SYMS: usize = 8;
const ALL_SYMS: usize = 16;

fn coordinate_moves<const M: usize>(
    size: usize,
    moves: [usize; M],
    move_cubes: &[CubieCube; N_MOVES],
    set: impl Fn(&mut CubieCube, usize),
    get: impl Fn(&CubieCube) -> usize,
) -> Vec<[u16; M]> {
    (0..size)
        .map(|index| {
            let mut cube = CubieCube::SOLVED;
            set(&mut cube, index);
            std::array::from_fn(|i| get(&cube.multiply(&move_cubes[moves[i]])) as u16)
        })
        .collect()
}

fn perm_moves<const N: usize>(size: usize, move_perm: impl Fn(usize) -> [u8; N]) -> Vec<[u16; 10]> {
    let moves: [[u8; N]; 10] = std::array::from_fn(move_perm);
    let mut perm = [0u8; N];
    let mut next = [0u8; N];
    (0..size)
        .map(|index| {
            unrank_perm(index, &mut perm);
            std::array::from_fn(|mv| {
                for (slot, &from) in next.iter_mut().zip(&moves[mv]) {
                    *slot = perm[usize::from(from)];
                }
                rank_perm(&next) as u16
            })
        })
        .collect()
}

fn tables() -> &'static Tables {
    static TABLES: OnceLock<Tables> = OnceLock::new();
    TABLES.get_or_init(|| {
        let move_cubes: [CubieCube; N_MOVES] = std::array::from_fn(|mv| CubieCube::SOLVED.apply_move(mv));
        let rotations = [CubieCube::SOLVED, ROTATE_URF, ROTATE_URF.multiply(&ROTATE_URF)];
        let move_map: [[usize; N_MOVES]; 3] = std::array::from_fn(|axis| {
            std::array::from_fn(|mv| {
                let conjugate = rotations[axis]
                    .multiply(&move_cubes[mv])
                    .multiply(&rotations[axis].inverse());
                move_cubes
                    .iter()
                    .position(|m| *m == conjugate)
                    .expect("rotation maps moves to moves")
            })
        });
        let all: [usize; N_MOVES] = std::array::from_fn(|mv| mv);
        let twist_move = coordinate_moves(N_TWIST, all, &move_cubes, set_twist, twist);
        let flip_move = coordinate_moves(N_FLIP, all, &move_cubes, set_flip, flip);
        let slice_move = coordinate_moves(N_SLICE, all, &move_cubes, set_slice, slice);
        let cperm_move = perm_moves::<8>(N_CPERM, |mv| move_cubes[PHASE2_MOVES[mv]].cp);
        let eperm_move = perm_moves::<8>(N_EPERM, |mv| {
            let mut perm = [0u8; 8];
            perm.copy_from_slice(&move_cubes[PHASE2_MOVES[mv]].ep[..8]);
            perm
        });
        let slice_perm_move = coordinate_moves(N_SLICE_PERM, PHASE2_MOVES, &move_cubes, set_slice_perm, slice_perm);

        let edge_safe = &symmetry::ud_symmetries().edge_safe;
        let all_syms: Vec<usize> = (0..ALL_SYMS).collect();
        let twist_sym = symmetry::reduce(N_TWIST, edge_safe, set_twist, twist);
        let flip_sym = symmetry::reduce(N_FLIP, edge_safe, set_flip, flip);
        let cperm_sym = symmetry::reduce(N_CPERM, &all_syms, set_cperm, cperm);
        let eperm_sym = symmetry::reduce(N_EPERM, &all_syms, set_eperm, eperm);
        let flip_conj = symmetry::conjugation_table(N_FLIP, edge_safe, set_flip, flip);
        let slice_conj = symmetry::conjugation_table(N_SLICE, edge_safe, set_slice, slice);
        let slice_perm_conj = symmetry::conjugation_table(N_SLICE_PERM, &all_syms, set_slice_perm, slice_perm);

        let twist_slice_prun = sym_distance_table(&twist_sym, &twist_move, &slice_move, &slice_conj, EDGE_SAFE_SYMS);
        let flip_slice_prun = sym_distance_table(&flip_sym, &flip_move, &slice_move, &slice_conj, EDGE_SAFE_SYMS);
        let twist_flip_prun = sym_distance_table(&twist_sym, &twist_move, &flip_move, &flip_conj, EDGE_SAFE_SYMS);
        let cperm_slice_prun =
            sym_distance_table(&cperm_sym, &cperm_move, &slice_perm_move, &slice_perm_conj, ALL_SYMS);
        let eperm_slice_prun =
            sym_distance_table(&eperm_sym, &eperm_move, &slice_perm_move, &slice_perm_conj, ALL_SYMS);

        Tables {
            move_cubes,
            rotations,
            move_map,
            twist_move,
            flip_move,
            slice_move,
            cperm_move,
            eperm_move,
            slice_perm_move,
            twist_sym,
            flip_sym,
            cperm_sym,
            eperm_sym,
            flip_conj,
            slice_conj,
            slice_perm_conj,
            twist_slice_prun,
            flip_slice_prun,
            twist_flip_prun,
            cperm_slice_prun,
            eperm_slice_prun,
        }
    })
}

impl Tables {
    fn phase1_bound(&self, twist: usize, flip: usize, slice: usize) -> usize {
        let (twist_class, twist_sym) = self.twist_sym.class(twist);
        let (flip_class, flip_sym) = self.flip_sym.class(flip);
        let flip_conj = usize::from(self.flip_conj[flip * EDGE_SAFE_SYMS + twist_sym]);
        let slice_by_twist = usize::from(self.slice_conj[slice * EDGE_SAFE_SYMS + twist_sym]);
        let slice_by_flip = usize::from(self.slice_conj[slice * EDGE_SAFE_SYMS + flip_sym]);
        self.twist_flip_prun[twist_class * N_FLIP + flip_conj]
            .max(self.twist_slice_prun[twist_class * N_SLICE + slice_by_twist])
            .max(self.flip_slice_prun[flip_class * N_SLICE + slice_by_flip])
            .into()
    }

    fn phase2_bound(&self, cperm: usize, eperm: usize, slice_perm: usize) -> usize {
        let (cperm_class, cperm_sym) = self.cperm_sym.class(cperm);
        let (eperm_class, eperm_sym) = self.eperm_sym.class(eperm);
        let slice_by_cperm = usize::from(self.slice_perm_conj[slice_perm * ALL_SYMS + cperm_sym]);
        let slice_by_eperm = usize::from(self.slice_perm_conj[slice_perm * ALL_SYMS + eperm_sym]);
        self.cperm_slice_prun[cperm_class * N_SLICE_PERM + slice_by_cperm]
            .max(self.eperm_slice_prun[eperm_class * N_SLICE_PERM + slice_by_eperm])
            .into()
    }
}

fn allowed_after(mv: usize, last: usize) -> bool {
    let face = mv / 3;
    let last_face = last / 3;
    face != last_face && face + 3 != last_face
}

struct Search<'a> {
    t: &'a Tables,
    cube: CubieCube,
    max_length: usize,
    first_forbidden: [bool; N_MOVES],
    last_forbidden: [bool; N_MOVES],
    start: (usize, usize, usize),
    phase1: Vec<usize>,
    phase2: Vec<usize>,
}

impl Search<'_> {
    fn allowed(&self, mv: usize, last: Option<usize>) -> bool {
        match last {
            Some(last) => allowed_after(mv, last),
            None => !self.first_forbidden[mv],
        }
    }

    fn phase1_bound(&self, twist: usize, flip: usize, slice: usize) -> usize {
        self.t.phase1_bound(twist, flip, slice)
    }

    fn search_phase1(&mut self, twist: usize, flip: usize, slice: usize, remaining: usize) -> bool {
        if remaining == 0 {
            let ends_outside_phase2 = self
                .phase1
                .last()
                .is_none_or(|&mv| mv % 3 != 1 && !matches!(mv / 3, 0 | 3));
            return twist == 0 && flip == 0 && slice == 0 && ends_outside_phase2 && self.start_phase2();
        }
        if self.phase1_bound(twist, flip, slice) > remaining {
            return false;
        }
        let last = self.phase1.last().copied();
        for mv in 0..N_MOVES {
            if !self.allowed(mv, last) {
                continue;
            }
            self.phase1.push(mv);
            let found = self.search_phase1(
                usize::from(self.t.twist_move[twist][mv]),
                usize::from(self.t.flip_move[flip][mv]),
                usize::from(self.t.slice_move[slice][mv]),
                remaining - 1,
            );
            if found {
                return true;
            }
            self.phase1.pop();
        }
        false
    }

    fn start_phase2(&mut self) -> bool {
        let cube = self
            .phase1
            .iter()
            .fold(self.cube, |c, &mv| c.multiply(&self.t.move_cubes[mv]));
        let cperm = rank_perm(&cube.cp);
        let eperm = rank_perm(&cube.ep[..8]);
        let slice_perm = slice_perm(&cube);
        let limit = (self.max_length - self.phase1.len()).min(MAX_PHASE2_LENGTH);
        let bound = self.phase2_bound(cperm, eperm, slice_perm);
        (bound..=limit).any(|length| {
            self.phase2.clear();
            self.search_phase2(cperm, eperm, slice_perm, length)
        })
    }

    fn phase2_bound(&self, cperm: usize, eperm: usize, slice_perm: usize) -> usize {
        self.t.phase2_bound(cperm, eperm, slice_perm)
    }

    fn search_phase2(&mut self, cperm: usize, eperm: usize, slice_perm: usize, remaining: usize) -> bool {
        let last = self.phase2.last().or(self.phase1.last()).copied();
        if remaining == 0 {
            return cperm == 0 && eperm == 0 && slice_perm == 0 && last.is_none_or(|mv| !self.last_forbidden[mv]);
        }
        if self.phase2_bound(cperm, eperm, slice_perm) > remaining {
            return false;
        }
        for (i, &mv) in PHASE2_MOVES.iter().enumerate() {
            if !self.allowed(mv, last) {
                continue;
            }
            self.phase2.push(mv);
            let found = self.search_phase2(
                usize::from(self.t.cperm_move[cperm][i]),
                usize::from(self.t.eperm_move[eperm][i]),
                usize::from(self.t.slice_perm_move[slice_perm][i]),
                remaining - 1,
            );
            if found {
                return true;
            }
            self.phase2.pop();
        }
        false
    }
}

pub fn solve(cube: &CubieCube, max_length: usize) -> Option<Vec<usize>> {
    solve_avoiding_first_axis(cube, max_length, None)
}

pub fn solve_avoiding_first_axis(
    cube: &CubieCube,
    max_length: usize,
    forbidden_first_axis: Option<usize>,
) -> Option<Vec<usize>> {
    let t = tables();
    let mut variants: Vec<(Search, usize, bool)> = Vec::with_capacity(6);
    for inverse in [false, true] {
        let base = if inverse { cube.inverse() } else { *cube };
        for axis in 0..3 {
            let rotated = t.rotations[axis].inverse().multiply(&base).multiply(&t.rotations[axis]);
            let mut first_forbidden = [false; N_MOVES];
            let mut last_forbidden = [false; N_MOVES];
            if let Some(forbidden) = forbidden_first_axis {
                for mv in 0..N_MOVES {
                    if t.move_map[axis][mv] / 3 % 3 == forbidden {
                        if inverse {
                            last_forbidden[mv] = true;
                        } else {
                            first_forbidden[mv] = true;
                        }
                    }
                }
            }
            let search = Search {
                t,
                cube: rotated,
                max_length,
                first_forbidden,
                last_forbidden,
                start: (twist(&rotated), flip(&rotated), slice(&rotated)),
                phase1: Vec::new(),
                phase2: Vec::new(),
            };
            variants.push((search, axis, inverse));
        }
    }
    for length in 0..=max_length {
        for (search, axis, inverse) in variants.iter_mut() {
            let (tw, fl, sl) = search.start;
            if search.phase1_bound(tw, fl, sl) > length {
                continue;
            }
            search.phase1.clear();
            if search.search_phase1(tw, fl, sl, length) {
                let moves: Vec<usize> = search
                    .phase1
                    .iter()
                    .chain(&search.phase2)
                    .map(|&mv| t.move_map[*axis][mv])
                    .collect();
                return Some(if *inverse { invert_moves(&moves) } else { moves });
            }
        }
    }
    None
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::random::Rng;

    #[test]
    fn coordinates_round_trip() {
        for index in 0..N_SLICE {
            let mut cube = CubieCube::SOLVED;
            set_slice(&mut cube, index);
            assert_eq!(slice(&cube), index);
        }
        for index in 0..N_TWIST {
            let mut cube = CubieCube::SOLVED;
            set_twist(&mut cube, index);
            assert_eq!(twist(&cube), index);
        }
        assert_eq!(slice(&CubieCube::SOLVED), 0);
    }

    #[test]
    fn symmetric_pruning_matches_raw_tables() {
        use crate::solve::distance_table;
        let t = tables();
        let twist_flip = distance_table(&t.twist_move, &t.flip_move);
        let twist_slice = distance_table(&t.twist_move, &t.slice_move);
        let flip_slice = distance_table(&t.flip_move, &t.slice_move);
        let cperm_slice = distance_table(&t.cperm_move, &t.slice_perm_move);
        let eperm_slice = distance_table(&t.eperm_move, &t.slice_perm_move);
        let mut rng = Rng::seeded(5);
        for _ in 0..200_000 {
            let (tw, fl, sl) = (
                rng.below_usize(N_TWIST),
                rng.below_usize(N_FLIP),
                rng.below_usize(N_SLICE),
            );
            let (tc, ts) = t.twist_sym.class(tw);
            let (fc, fs) = t.flip_sym.class(fl);
            let flip_conj = usize::from(t.flip_conj[fl * EDGE_SAFE_SYMS + ts]);
            assert_eq!(t.twist_flip_prun[tc * N_FLIP + flip_conj], twist_flip[tw * N_FLIP + fl]);
            let slice_conj = usize::from(t.slice_conj[sl * EDGE_SAFE_SYMS + ts]);
            assert_eq!(
                t.twist_slice_prun[tc * N_SLICE + slice_conj],
                twist_slice[tw * N_SLICE + sl]
            );
            let slice_conj = usize::from(t.slice_conj[sl * EDGE_SAFE_SYMS + fs]);
            assert_eq!(
                t.flip_slice_prun[fc * N_SLICE + slice_conj],
                flip_slice[fl * N_SLICE + sl]
            );

            let (cp, ep, sp) = (
                rng.below_usize(N_CPERM),
                rng.below_usize(N_EPERM),
                rng.below_usize(N_SLICE_PERM),
            );
            let (cc, cs) = t.cperm_sym.class(cp);
            let (ec, es) = t.eperm_sym.class(ep);
            let sp_c = usize::from(t.slice_perm_conj[sp * ALL_SYMS + cs]);
            assert_eq!(
                t.cperm_slice_prun[cc * N_SLICE_PERM + sp_c],
                cperm_slice[cp * N_SLICE_PERM + sp]
            );
            let sp_e = usize::from(t.slice_perm_conj[sp * ALL_SYMS + es]);
            assert_eq!(
                t.eperm_slice_prun[ec * N_SLICE_PERM + sp_e],
                eperm_slice[ep * N_SLICE_PERM + sp]
            );
        }
        assert_eq!((t.twist_sym.reps.len(), t.flip_sym.reps.len()), (324, 336));
        assert_eq!((t.cperm_sym.reps.len(), t.eperm_sym.reps.len()), (2768, 2768));
    }

    #[test]
    fn rotation_cycles_the_axes() {
        let t = tables();
        assert!(ROTATE_URF.multiply(&ROTATE_URF).multiply(&ROTATE_URF).is_solved());
        let mut faces: Vec<usize> = t.move_map[1].iter().step_by(3).map(|mv| mv / 3).collect();
        faces.sort_unstable();
        assert_eq!(faces, vec![0, 1, 2, 3, 4, 5]);
        assert_ne!(t.move_map[1][0] / 3, 0);
    }

    #[test]
    fn solves_random_cubes_within_21_moves() {
        let mut rng = Rng::seeded(1);
        for _ in 0..300 {
            let cube = CubieCube::random(&mut rng);
            let solution = solve(&cube, 21).expect("solution");
            assert!(solution.len() <= 21);
            assert!(cube.apply_moves(&solution).is_solved());
            assert!(
                solution.windows(2).all(|pair| pair[0] / 3 != pair[1] / 3),
                "{solution:?}"
            );
        }
    }

    #[test]
    fn respects_a_forbidden_first_axis() {
        let mut rng = Rng::seeded(2);
        for axis in [0, 1, 2, 0, 1, 2] {
            let cube = CubieCube::random(&mut rng);
            let solution = solve_avoiding_first_axis(&cube, 21, Some(axis)).expect("solution");
            assert!(cube.apply_moves(&solution).is_solved());
            assert_ne!(solution[0] / 3 % 3, axis);
        }
    }

    #[test]
    #[ignore]
    fn timing() {
        let mut rng = Rng::seeded(9);
        let start = std::time::Instant::now();
        tables();
        println!("tables {:.0} ms", start.elapsed().as_secs_f64() * 1000.0);
        let mut times: Vec<f64> = (0..300)
            .map(|_| {
                let cube = CubieCube::random(&mut rng);
                let start = std::time::Instant::now();
                solve(&cube, 21).unwrap();
                start.elapsed().as_secs_f64() * 1000.0
            })
            .collect();
        times.sort_by(f64::total_cmp);
        println!(
            "median {:.2} ms p90 {:.2} ms max {:.2} ms",
            times[150], times[270], times[299]
        );
    }
}
