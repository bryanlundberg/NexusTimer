use std::sync::OnceLock;

use crate::random::Rng;
use crate::wca;

const N_MOVES: usize = 4;
const HALF_FACTORIAL: [u32; 7] = [1, 1, 1, 3, 12, 60, 360];
const TWIST_ORIENTATIONS: usize = 2187;
const FREE_CORNER_PERM: usize = 12;
const CENTER_PERM: usize = 360;
const SKEWB_PERMUTATIONS: usize = FREE_CORNER_PERM * CENTER_PERM;
const PRUNING_DEPTH: i8 = 6;
const SCRAMBLE_LENGTH: usize = 11;
const MIN_DISTANCE: usize = 7;

const CORNER_PERM_MOVE: [[u8; 4]; 12] = [
    [6, 5, 10, 1],
    [9, 7, 4, 2],
    [3, 11, 8, 0],
    [10, 1, 6, 5],
    [0, 8, 11, 3],
    [7, 9, 2, 4],
    [4, 2, 9, 7],
    [11, 3, 0, 8],
    [1, 10, 5, 6],
    [8, 0, 3, 11],
    [2, 4, 7, 9],
    [5, 6, 1, 10],
];

const PERM_TWIST: [u8; 12] = [0, 1, 2, 0, 2, 1, 1, 2, 0, 2, 1, 0];

fn pack_center_perm(centers: &[u32; 6]) -> usize {
    let mut index = 0u32;
    let mut val: u32 = 0x543210;
    for (i, &center) in centers.iter().take(4).enumerate() {
        let v = center << 2;
        index = (6 - i as u32) * index + ((val >> v) & 0xf);
        val = val.wrapping_sub(0x111110u32 << v);
    }
    index as usize
}

fn perm_move(index: usize, mv: usize) -> usize {
    let mut center_index = (index / FREE_CORNER_PERM) as u32;
    let corner_index = index % FREE_CORNER_PERM;
    let mut val: u32 = 0x543210;
    let mut parity = 0;
    let mut centers = [0u32; 6];
    for (i, center) in centers.iter_mut().take(5).enumerate() {
        let p = HALF_FACTORIAL[5 - i];
        let mut v = center_index / p;
        center_index -= v * p;
        parity ^= v;
        v <<= 2;
        *center = (val >> v) & 0xf;
        let m = (1u32 << v) - 1;
        val = (val & m) + ((val >> 4) & !m);
    }
    if parity & 1 == 0 {
        centers[5] = val;
    } else {
        centers[5] = centers[4];
        centers[4] = val;
    }
    let cycle = match mv {
        0 => [0, 1, 3],
        1 => [0, 4, 2],
        2 => [1, 2, 5],
        _ => [3, 5, 4],
    };
    let first = centers[cycle[0]];
    centers[cycle[0]] = centers[cycle[1]];
    centers[cycle[1]] = centers[cycle[2]];
    centers[cycle[2]] = first;
    pack_center_perm(&centers) * FREE_CORNER_PERM + usize::from(CORNER_PERM_MOVE[corner_index][mv])
}

fn twist_move(mut index: usize, mv: usize) -> usize {
    let mut fixed = [0usize; 4];
    let mut free = [0usize; 4];
    for twist in fixed.iter_mut() {
        *twist = index % 3;
        index /= 3;
    }
    for twist in free.iter_mut().take(3) {
        *twist = index % 3;
        index /= 3;
    }
    free[3] = (6 - free[0] - free[1] - free[2]) % 3;
    fixed[mv] = (fixed[mv] + 1) % 3;
    let cycle = match mv {
        0 => [0, 2, 1],
        1 => [0, 1, 3],
        2 => [0, 3, 2],
        _ => [1, 2, 3],
    };
    let first = free[cycle[0]];
    free[cycle[0]] = free[cycle[1]] + 2;
    free[cycle[1]] = free[cycle[2]] + 2;
    free[cycle[2]] = first + 2;
    let mut packed = 0;
    for &twist in free[..3].iter().rev() {
        packed = packed * 3 + twist % 3;
    }
    for &twist in fixed.iter().rev() {
        packed = packed * 3 + twist;
    }
    packed
}

struct Tables {
    perm_move: Vec<[u16; N_MOVES]>,
    twist_move: Vec<[u16; N_MOVES]>,
    perm_prun: Vec<i8>,
    twist_prun: Vec<i8>,
}

fn pruning(size: usize, moves: &[[u16; N_MOVES]]) -> Vec<i8> {
    let mut prun = vec![-1i8; size];
    prun[0] = 0;
    for depth in 0..PRUNING_DEPTH {
        for index in 0..size {
            if prun[index] != depth {
                continue;
            }
            for mv in 0..N_MOVES {
                let mut target = index;
                for _ in 0..2 {
                    target = usize::from(moves[target][mv]);
                    if prun[target] == -1 {
                        prun[target] = depth + 1;
                    }
                }
            }
        }
    }
    prun
}

fn tables() -> &'static Tables {
    static TABLES: OnceLock<Tables> = OnceLock::new();
    TABLES.get_or_init(|| {
        let perm_move: Vec<[u16; N_MOVES]> = (0..SKEWB_PERMUTATIONS)
            .map(|index| std::array::from_fn(|mv| perm_move(index, mv) as u16))
            .collect();
        let twist_move: Vec<[u16; N_MOVES]> = (0..TWIST_ORIENTATIONS)
            .map(|index| std::array::from_fn(|mv| twist_move(index, mv) as u16))
            .collect();
        let perm_prun = pruning(SKEWB_PERMUTATIONS, &perm_move);
        let twist_prun = pruning(TWIST_ORIENTATIONS, &twist_move);
        Tables {
            perm_move,
            twist_move,
            perm_prun,
            twist_prun,
        }
    })
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct SkewbState {
    pub perm: usize,
    pub twist: usize,
}

impl SkewbState {
    fn is_solvable(self) -> bool {
        let t = self.twist;
        usize::from(PERM_TWIST[self.perm % 12]) == (t + t / 3 + t / 9 + t / 27) % 3
    }

    fn apply(self, mv: usize) -> SkewbState {
        let t = tables();
        SkewbState {
            perm: usize::from(t.perm_move[self.perm][mv]),
            twist: usize::from(t.twist_move[self.twist][mv]),
        }
    }

    fn pruned(self, remaining: usize) -> bool {
        let t = tables();
        let remaining = remaining as i8;
        t.perm_prun[self.perm] > remaining || t.twist_prun[self.twist] > remaining
    }

    fn is_solved(self) -> bool {
        self.perm == 0 && self.twist == 0
    }

    fn reachable_in(self, remaining: usize, last_axis: usize) -> bool {
        if remaining == 0 {
            return self.is_solved();
        }
        if self.pruned(remaining) {
            return false;
        }
        (0..N_MOVES).filter(|&axis| axis != last_axis).any(|axis| {
            let once = self.apply(axis);
            once.reachable_in(remaining - 1, axis) || once.apply(axis).reachable_in(remaining - 1, axis)
        })
    }

    pub fn solvable_within(&self, moves: usize) -> bool {
        (0..=moves).any(|length| self.reachable_in(length, usize::MAX))
    }

    fn solve_exactly(self, remaining: usize, last_axis: usize, solution: &mut Vec<usize>, rng: &mut Rng) -> bool {
        if remaining == 0 {
            return self.is_solved();
        }
        if self.pruned(remaining) {
            return false;
        }
        let offset = rng.below_usize(N_MOVES);
        for step in 0..N_MOVES {
            let axis = (step + offset) % N_MOVES;
            if axis == last_axis {
                continue;
            }
            let mut next = self;
            for power in 0..2 {
                next = next.apply(axis);
                solution.push(axis * 2 + power);
                if next.solve_exactly(remaining - 1, axis, solution, rng) {
                    return true;
                }
                solution.pop();
            }
        }
        false
    }
}

fn solution_names(solution: &[usize]) -> Vec<String> {
    let mut names = ["L", "R", "B", "U"];
    solution
        .iter()
        .map(|&mv| {
            let axis = mv >> 1;
            let power = mv & 1;
            if axis == 2 {
                for _ in 0..=power {
                    let first = names[0];
                    names[0] = names[1];
                    names[1] = names[3];
                    names[3] = first;
                }
            }
            format!("{}{}", names[axis], if power == 1 { "'" } else { "" })
        })
        .collect()
}

fn invert(names: &[String]) -> String {
    names
        .iter()
        .rev()
        .map(|name| match name.strip_suffix('\'') {
            Some(base) => base.to_string(),
            None => format!("{name}'"),
        })
        .collect::<Vec<_>>()
        .join(" ")
}

pub fn random(rng: &mut Rng) -> (SkewbState, String) {
    let perm = rng.below_usize(SKEWB_PERMUTATIONS);
    let state = loop {
        let candidate = SkewbState {
            perm,
            twist: rng.below_usize(TWIST_ORIENTATIONS),
        };
        if candidate.is_solvable() {
            break candidate;
        }
    };
    let mut solution = Vec::with_capacity(SCRAMBLE_LENGTH);
    assert!(state.solve_exactly(SCRAMBLE_LENGTH, usize::MAX, &mut solution, rng));
    (state, invert(&solution_names(&solution)))
}

pub fn generate(rng: &mut Rng) -> (SkewbState, String) {
    wca::generate(rng, MIN_DISTANCE, random, SkewbState::solvable_within)
}

pub fn scramble(rng: &mut Rng) -> String {
    generate(rng).1
}

#[cfg(feature = "oracle")]
pub fn describe(state: &SkewbState) -> String {
    format!("{},{}", state.perm, state.twist)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn exact_solutions_solve_the_sampled_state() {
        let mut rng = Rng::seeded(1);
        for _ in 0..300 {
            let perm = rng.below_usize(SKEWB_PERMUTATIONS);
            let state = loop {
                let candidate = SkewbState {
                    perm,
                    twist: rng.below_usize(TWIST_ORIENTATIONS),
                };
                if candidate.is_solvable() {
                    break candidate;
                }
            };
            let mut solution = Vec::new();
            assert!(state.solve_exactly(SCRAMBLE_LENGTH, usize::MAX, &mut solution, &mut rng));
            let end = solution
                .iter()
                .fold(state, |s, &mv| (0..=mv & 1).fold(s, |s, _| s.apply(mv >> 1)));
            assert!(end.is_solved());
        }
    }

    #[test]
    fn scrambles_use_wca_notation_and_length() {
        let mut rng = Rng::seeded(2);
        for _ in 0..300 {
            let scramble = scramble(&mut rng);
            let tokens: Vec<&str> = scramble.split(' ').collect();
            assert_eq!(tokens.len(), SCRAMBLE_LENGTH);
            assert!(
                tokens
                    .iter()
                    .all(|t| ["R", "U", "L", "B", "R'", "U'", "L'", "B'"].contains(t)),
                "{scramble}"
            );
        }
    }

    #[test]
    fn generated_states_respect_the_minimum_distance() {
        let mut rng = Rng::seeded(3);
        let mut accepted = 0;
        while accepted < 200 {
            let (state, _) = random(&mut rng);
            if !state.solvable_within(MIN_DISTANCE - 1) {
                accepted += 1;
            }
        }
        let close = SkewbState { perm: 0, twist: 0 }.apply(0).apply(1);
        assert!(close.solvable_within(MIN_DISTANCE - 1));
    }
}
