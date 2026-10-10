use std::sync::OnceLock;

use crate::random::Rng;
use crate::wca;

const N_PERM: usize = 5040;
const N_ORIENT: usize = 729;
const N_MOVES: usize = 9;
const SCRAMBLE_LENGTH: usize = 11;
const MIN_DISTANCE: usize = 4;
const INVERSE_NAMES: [&str; N_MOVES] = ["U'", "U2", "U", "R'", "R2", "R", "F'", "F2", "F"];
const FACTORIAL: [usize; 7] = [1, 1, 2, 6, 24, 120, 720];

#[derive(Clone, Copy, Default)]
struct Cubie {
    piece: u8,
    twist: u8,
}

type Cubies = [Cubie; 7];

fn pack_perm(cubies: &Cubies) -> usize {
    let mut index = 0;
    for i in 0..6 {
        let smaller = cubies[i + 1..].iter().filter(|c| c.piece < cubies[i].piece).count();
        index += smaller * FACTORIAL[6 - i];
    }
    index
}

fn unpack_perm(mut index: usize) -> Cubies {
    let mut remaining: Vec<u8> = (0..7).collect();
    let mut cubies = Cubies::default();
    for (i, cubie) in cubies.iter_mut().enumerate() {
        let f = FACTORIAL[6 - i];
        cubie.piece = remaining.remove(index / f);
        index %= f;
    }
    cubies
}

fn pack_orient(cubies: &Cubies) -> usize {
    cubies[..6].iter().fold(0, |acc, c| acc * 3 + usize::from(c.twist))
}

fn unpack_orient(mut index: usize) -> Cubies {
    let mut cubies = Cubies::default();
    let mut sum = 0;
    for cubie in cubies[..6].iter_mut().rev() {
        cubie.twist = (index % 3) as u8;
        sum += cubie.twist;
        index /= 3;
    }
    cubies[6].twist = (3 - sum % 3) % 3;
    cubies
}

fn cycle(cubies: &mut Cubies, [a, b, c, d]: [usize; 4], twists: [u8; 4]) {
    let last = cubies[d];
    cubies[d] = cubies[c];
    cubies[c] = cubies[b];
    cubies[b] = cubies[a];
    cubies[a] = last;
    for (position, twist) in [a, b, c, d].into_iter().zip(twists) {
        cubies[position].twist = (cubies[position].twist + twist) % 3;
    }
}

fn apply_move(cubies: &mut Cubies, mv: usize) {
    for _ in 0..=mv % 3 {
        match mv / 3 {
            0 => cycle(cubies, [1, 3, 2, 0], [0, 0, 0, 0]),
            1 => cycle(cubies, [0, 2, 6, 4], [2, 1, 2, 1]),
            _ => cycle(cubies, [1, 0, 4, 5], [2, 1, 2, 1]),
        }
    }
}

struct Tables {
    perm_move: Vec<[u16; N_MOVES]>,
    orient_move: Vec<[u16; N_MOVES]>,
    distance: Vec<u8>,
}

fn full_distances(perm_move: &[[u16; N_MOVES]], orient_move: &[[u16; N_MOVES]]) -> Vec<u8> {
    let total = N_PERM * N_ORIENT;
    let mut distance = vec![u8::MAX; total];
    distance[0] = 0;
    let mut visited = 1;
    let mut depth = 0u8;
    while visited < total {
        let backward = visited > total / 2;
        let mut found = 0;
        for perm in 0..N_PERM {
            let perm_moves = &perm_move[perm];
            for orient in 0..N_ORIENT {
                let index = perm * N_ORIENT + orient;
                let neighbor =
                    |mv: usize| usize::from(perm_moves[mv]) * N_ORIENT + usize::from(orient_move[orient][mv]);
                if backward {
                    if distance[index] == u8::MAX && (0..N_MOVES).any(|mv| distance[neighbor(mv)] == depth) {
                        distance[index] = depth + 1;
                        found += 1;
                    }
                } else if distance[index] == depth {
                    for mv in 0..N_MOVES {
                        let target = neighbor(mv);
                        if distance[target] == u8::MAX {
                            distance[target] = depth + 1;
                            found += 1;
                        }
                    }
                }
            }
        }
        visited += found;
        depth += 1;
    }
    distance
}

fn tables() -> &'static Tables {
    static TABLES: OnceLock<Tables> = OnceLock::new();
    TABLES.get_or_init(|| {
        let perm_move: Vec<[u16; N_MOVES]> = (0..N_PERM)
            .map(|perm| {
                std::array::from_fn(|mv| {
                    let mut cubies = unpack_perm(perm);
                    apply_move(&mut cubies, mv);
                    pack_perm(&cubies) as u16
                })
            })
            .collect();
        let orient_move: Vec<[u16; N_MOVES]> = (0..N_ORIENT)
            .map(|orient| {
                std::array::from_fn(|mv| {
                    let mut cubies = unpack_orient(orient);
                    apply_move(&mut cubies, mv);
                    pack_orient(&cubies) as u16
                })
            })
            .collect();
        let distance = full_distances(&perm_move, &orient_move);
        Tables {
            perm_move,
            orient_move,
            distance,
        }
    })
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct TwoState {
    pub perm: usize,
    pub orient: usize,
}

impl TwoState {
    fn apply(self, mv: usize) -> TwoState {
        let t = tables();
        TwoState {
            perm: usize::from(t.perm_move[self.perm][mv]),
            orient: usize::from(t.orient_move[self.orient][mv]),
        }
    }

    fn is_solved(self) -> bool {
        self.perm == 0 && self.orient == 0
    }

    fn distance(self) -> usize {
        usize::from(tables().distance[self.perm * N_ORIENT + self.orient])
    }

    pub fn solvable_within(&self, moves: usize) -> bool {
        self.distance() <= moves
    }
}

struct Exact {
    solution: [usize; SCRAMBLE_LENGTH],
    best: Option<(u32, [usize; SCRAMBLE_LENGTH])>,
}

impl Exact {
    fn search(&mut self, state: TwoState, depth: usize, last_face: usize) {
        let remaining = SCRAMBLE_LENGTH - depth;
        if remaining == 0 {
            if state.is_solved() {
                let cost = scramble_cost(&self.solution);
                if self.best.is_none_or(|(best, _)| cost < best) {
                    self.best = Some((cost, self.solution));
                }
            }
            return;
        }
        if state.distance() > remaining {
            return;
        }
        for mv in 0..N_MOVES {
            if mv / 3 == last_face {
                continue;
            }
            self.solution[depth] = mv;
            self.search(state.apply(mv), depth + 1, mv / 3);
        }
    }
}

const COST_U: u32 = 8;
const COST_U_LOW: u32 = 20;
const COST_U2: u32 = 10;
const COST_U3: u32 = 7;
const COST_R: u32 = 6;
const COST_R2: u32 = 10;
const COST_R3: u32 = 6;
const COST_F: u32 = 10;
const COST_F2: u32 = 30;
const COST_F3: u32 = 19;
const COST_REGRIP: u32 = 20;

fn grip_options(mv: usize, grip: i32) -> &'static [(u32, i32)] {
    match (mv, grip) {
        (0, -1) => &[(COST_U3, -1)],
        (0, 0) => &[(COST_U3, 0)],
        (0, _) => &[(COST_U3, 1)],
        (1, -1) => &[(COST_U2, -1)],
        (1, 0) => &[(COST_U2, 0)],
        (1, _) => &[(COST_U2, 1)],
        (2, 0) => &[(COST_U, 0)],
        (2, -1) => &[(COST_REGRIP + COST_U, 0), (COST_U_LOW, -1)],
        (2, _) => &[(COST_REGRIP + COST_U, 0)],
        (3, 0) => &[(COST_R3, -1)],
        (3, 1) => &[(COST_R3, 0)],
        (3, _) => &[(COST_REGRIP + COST_R3, -1)],
        (4, -1) => &[(COST_R2, 1)],
        (4, 1) => &[(COST_R2, -1)],
        (4, _) => &[(COST_REGRIP + COST_R2, -1), (COST_REGRIP + COST_R2, 1)],
        (5, -1) => &[(COST_R, 0)],
        (5, 0) => &[(COST_R, 1)],
        (5, _) => &[(COST_REGRIP + COST_R, 1)],
        (6, -1) => &[(COST_F3, -1)],
        (6, 1) => &[(COST_F3, 1)],
        (6, _) => &[(COST_REGRIP + COST_F3, -1), (COST_REGRIP + COST_F3, 1)],
        (7, -1) => &[(COST_F2, -1)],
        (7, _) => &[(COST_REGRIP + COST_F2, -1)],
        (_, -1) => &[(COST_F, -1)],
        _ => &[(COST_REGRIP + COST_F, -1)],
    }
}

fn scramble_cost(solution: &[usize]) -> u32 {
    let mut cost = [0u32; 3];
    for &mv in solution {
        cost = std::array::from_fn(|grip| {
            grip_options(mv, grip as i32 - 1)
                .iter()
                .map(|&(extra, next)| extra + cost[(next + 1) as usize])
                .min()
                .unwrap()
        });
    }
    cost[1]
}

fn generate_exactly(state: TwoState) -> String {
    let mut exact = Exact {
        solution: [0; SCRAMBLE_LENGTH],
        best: None,
    };
    exact.search(state, 0, usize::MAX);
    let (_, solution) = exact.best.expect("every 2x2 state has an 11 move generator");
    solution
        .iter()
        .rev()
        .map(|&mv| INVERSE_NAMES[mv])
        .collect::<Vec<_>>()
        .join(" ")
}

pub fn random(rng: &mut Rng) -> (TwoState, String) {
    let state = TwoState {
        perm: rng.below_usize(N_PERM),
        orient: rng.below_usize(N_ORIENT),
    };
    (state, generate_exactly(state))
}

pub fn generate(rng: &mut Rng) -> (TwoState, String) {
    wca::generate(rng, MIN_DISTANCE, random, TwoState::solvable_within)
}

pub fn scramble(rng: &mut Rng) -> String {
    generate(rng).1
}

#[cfg(feature = "oracle")]
pub fn describe(state: &TwoState) -> String {
    format!("{},{}", state.perm, state.orient)
}

#[cfg(test)]
mod tests {
    use super::*;

    const MOVE_NAMES: [&str; N_MOVES] = ["U", "U2", "U'", "R", "R2", "R'", "F", "F2", "F'"];

    fn apply_scramble(scramble: &str) -> TwoState {
        scramble
            .split(' ')
            .fold(TwoState { perm: 0, orient: 0 }, |state, token| {
                state.apply(MOVE_NAMES.iter().position(|name| *name == token).unwrap())
            })
    }

    #[test]
    fn coordinates_round_trip() {
        for perm in 0..N_PERM {
            assert_eq!(pack_perm(&unpack_perm(perm)), perm);
        }
        for orient in 0..N_ORIENT {
            assert_eq!(pack_orient(&unpack_orient(orient)), orient);
        }
    }

    #[test]
    fn every_state_is_reachable_within_gods_number() {
        assert_eq!(tables().distance.iter().max(), Some(&11));
    }

    #[test]
    fn scramble_reaches_the_sampled_state() {
        let mut rng = Rng::seeded(1);
        for _ in 0..300 {
            let (state, scramble) = random(&mut rng);
            assert_eq!(scramble.split(' ').count(), SCRAMBLE_LENGTH);
            assert_eq!(apply_scramble(&scramble), state);
        }
    }

    #[test]
    fn scrambles_respect_the_minimum_distance() {
        let mut rng = Rng::seeded(2);
        for _ in 0..300 {
            let scramble = scramble(&mut rng);
            assert!(
                !apply_scramble(&scramble).solvable_within(MIN_DISTANCE - 1),
                "{scramble}"
            );
        }
    }

    #[test]
    fn rejects_states_close_to_solved() {
        assert!(apply_scramble("R U R'").solvable_within(3));
        assert!(!apply_scramble("R U R' U R U2 R'").solvable_within(3));
    }
}
