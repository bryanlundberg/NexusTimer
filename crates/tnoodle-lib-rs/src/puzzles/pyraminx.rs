use std::sync::OnceLock;

use crate::random::Rng;
use crate::wca;

const N_EDGE_PERM: usize = 720;
const N_EDGE_ORIENT: usize = 32;
const N_CORNER_ORIENT: usize = 81;
const N_ORIENT: usize = N_EDGE_ORIENT * N_CORNER_ORIENT;
const N_TIPS: usize = 81;
const N_MOVES: usize = 8;
const SCRAMBLE_LENGTH: usize = 11;
const MIN_DISTANCE: usize = 6;
const INVERSE_NAMES: [&str; N_MOVES] = ["U'", "U", "L'", "L", "R'", "R", "B'", "B"];
const TIP_NAMES: [&str; N_MOVES] = ["u", "u'", "l", "l'", "r", "r'", "b", "b'"];
const FACTORIAL: [usize; 6] = [1, 1, 2, 6, 24, 120];
const EDGE_CYCLES: [[usize; 3]; 4] = [[5, 3, 1], [2, 1, 0], [0, 3, 4], [2, 4, 5]];

#[derive(Clone, Copy, Default)]
struct Edge {
    piece: u8,
    flip: u8,
}

type Edges = [Edge; 6];

fn pack_edge_perm(edges: &Edges) -> usize {
    (0..5)
        .map(|i| edges[i + 1..].iter().filter(|e| e.piece < edges[i].piece).count() * FACTORIAL[5 - i])
        .sum()
}

fn unpack_edge_perm(mut index: usize) -> Edges {
    let mut remaining: Vec<u8> = (0..6).collect();
    let mut edges = Edges::default();
    for (i, edge) in edges.iter_mut().enumerate() {
        let f = FACTORIAL[5 - i];
        edge.piece = remaining.remove(index / f);
        index %= f;
    }
    edges
}

fn pack_edge_orient(edges: &Edges) -> usize {
    edges[..5].iter().fold(0, |acc, e| acc * 2 + usize::from(e.flip))
}

fn unpack_edge_orient(mut index: usize) -> Edges {
    let mut edges = Edges::default();
    let mut parity = 0;
    for edge in edges[..5].iter_mut().rev() {
        edge.flip = (index & 1) as u8;
        parity ^= edge.flip;
        index >>= 1;
    }
    edges[5].flip = parity;
    edges
}

fn pack_base3(values: &[u8; 4]) -> usize {
    values.iter().fold(0, |acc, &v| acc * 3 + usize::from(v))
}

fn unpack_base3(mut index: usize) -> [u8; 4] {
    let mut values = [0u8; 4];
    for value in values.iter_mut().rev() {
        *value = (index % 3) as u8;
        index /= 3;
    }
    values
}

fn move_edges(edges: &mut Edges, mv: usize) {
    let [a, b, c] = EDGE_CYCLES[mv / 2];
    for _ in 0..=mv % 2 {
        let last = edges[c];
        edges[c] = Edge {
            flip: edges[b].flip ^ 1,
            ..edges[b]
        };
        edges[b] = Edge {
            flip: edges[a].flip ^ 1,
            ..edges[a]
        };
        edges[a] = last;
    }
}

struct Tables {
    edge_perm_move: Vec<[u16; N_MOVES]>,
    edge_orient_move: Vec<[u8; N_MOVES]>,
    corner_orient_move: Vec<[u8; N_MOVES]>,
    perm_prun: Vec<u8>,
    orient_prun: Vec<u8>,
}

fn bfs(size: usize, next: impl Fn(usize, usize) -> usize) -> Vec<u8> {
    let mut distance = vec![u8::MAX; size];
    distance[0] = 0;
    let mut frontier = vec![0];
    let mut depth = 0;
    while !frontier.is_empty() {
        depth += 1;
        let mut following = Vec::new();
        for index in frontier {
            for mv in 0..N_MOVES {
                let target = next(index, mv);
                if distance[target] == u8::MAX {
                    distance[target] = depth;
                    following.push(target);
                }
            }
        }
        frontier = following;
    }
    distance
}

fn tables() -> &'static Tables {
    static TABLES: OnceLock<Tables> = OnceLock::new();
    TABLES.get_or_init(|| {
        let edge_perm_move: Vec<[u16; N_MOVES]> = (0..N_EDGE_PERM)
            .map(|perm| {
                std::array::from_fn(|mv| {
                    let mut edges = unpack_edge_perm(perm);
                    move_edges(&mut edges, mv);
                    pack_edge_perm(&edges) as u16
                })
            })
            .collect();
        let edge_orient_move: Vec<[u8; N_MOVES]> = (0..N_EDGE_ORIENT)
            .map(|orient| {
                std::array::from_fn(|mv| {
                    let mut edges = unpack_edge_orient(orient);
                    move_edges(&mut edges, mv);
                    pack_edge_orient(&edges) as u8
                })
            })
            .collect();
        let corner_orient_move: Vec<[u8; N_MOVES]> = (0..N_CORNER_ORIENT)
            .map(|orient| {
                std::array::from_fn(|mv| {
                    let mut corners = unpack_base3(orient);
                    corners[mv / 2] = (corners[mv / 2] + (mv % 2) as u8 + 1) % 3;
                    pack_base3(&corners) as u8
                })
            })
            .collect();
        let perm_prun = bfs(N_EDGE_PERM, |i, mv| usize::from(edge_perm_move[i][mv]));
        let orient_prun = bfs(N_ORIENT, |i, mv| {
            let edge = usize::from(edge_orient_move[i % N_EDGE_ORIENT][mv]);
            let corner = usize::from(corner_orient_move[i / N_EDGE_ORIENT][mv]);
            corner * N_EDGE_ORIENT + edge
        });
        Tables {
            edge_perm_move,
            edge_orient_move,
            corner_orient_move,
            perm_prun,
            orient_prun,
        }
    })
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct PyraState {
    pub edge_perm: usize,
    pub edge_orient: usize,
    pub corner_orient: usize,
    pub tips: usize,
}

impl PyraState {
    fn apply(self, mv: usize) -> PyraState {
        let t = tables();
        PyraState {
            edge_perm: usize::from(t.edge_perm_move[self.edge_perm][mv]),
            edge_orient: usize::from(t.edge_orient_move[self.edge_orient][mv]),
            corner_orient: usize::from(t.corner_orient_move[self.corner_orient][mv]),
            tips: self.tips,
        }
    }

    fn pruned(self, remaining: usize) -> bool {
        let t = tables();
        usize::from(t.perm_prun[self.edge_perm]) > remaining
            || usize::from(t.orient_prun[self.corner_orient * N_EDGE_ORIENT + self.edge_orient]) > remaining
    }

    fn body_solved(self) -> bool {
        self.edge_perm == 0 && self.edge_orient == 0 && self.corner_orient == 0
    }

    fn unsolved_tips(self) -> usize {
        unpack_base3(self.tips).iter().filter(|&&tip| tip > 0).count()
    }

    fn reachable_in(self, remaining: usize, last_face: usize) -> bool {
        if remaining == 0 {
            return self.body_solved();
        }
        if self.pruned(remaining) {
            return false;
        }
        (0..N_MOVES).any(|mv| mv / 2 != last_face && self.apply(mv).reachable_in(remaining - 1, mv / 2))
    }

    pub fn solvable_within(&self, moves: usize) -> bool {
        let tips = self.unsolved_tips();
        tips <= moves && (0..=moves - tips).any(|length| self.reachable_in(length, usize::MAX))
    }

    fn solve_exactly(self, remaining: usize, last_face: usize, solution: &mut Vec<usize>, rng: &mut Rng) -> bool {
        if remaining == 0 {
            return self.body_solved();
        }
        if self.pruned(remaining) {
            return false;
        }
        let offset = rng.below_usize(N_MOVES);
        for step in 0..N_MOVES {
            let mv = (step + offset) % N_MOVES;
            if mv / 2 == last_face {
                continue;
            }
            solution.push(mv);
            if self.apply(mv).solve_exactly(remaining - 1, mv / 2, solution, rng) {
                return true;
            }
            solution.pop();
        }
        false
    }
}

pub fn random(rng: &mut Rng) -> (PyraState, String) {
    let edge_perm = loop {
        let perm = rng.below_usize(N_EDGE_PERM);
        if tables().perm_prun[perm] != u8::MAX {
            break perm;
        }
    };
    let state = PyraState {
        edge_perm,
        edge_orient: rng.below_usize(N_EDGE_ORIENT),
        corner_orient: rng.below_usize(N_CORNER_ORIENT),
        tips: rng.below_usize(N_TIPS),
    };
    let mut solution = Vec::with_capacity(SCRAMBLE_LENGTH);
    assert!(state.solve_exactly(SCRAMBLE_LENGTH, usize::MAX, &mut solution, rng));
    let mut moves: Vec<&str> = solution.iter().rev().map(|&mv| INVERSE_NAMES[mv]).collect();
    for (tip, &turns) in unpack_base3(state.tips).iter().enumerate() {
        if turns > 0 {
            moves.push(TIP_NAMES[tip * 2 + usize::from(turns) - 1]);
        }
    }
    (state, moves.join(" "))
}

pub fn generate(rng: &mut Rng) -> (PyraState, String) {
    wca::generate(rng, MIN_DISTANCE, random, PyraState::solvable_within)
}

pub fn scramble(rng: &mut Rng) -> String {
    generate(rng).1
}

#[cfg(feature = "oracle")]
pub fn describe(state: &PyraState) -> String {
    format!(
        "{},{},{},{}",
        state.edge_perm, state.edge_orient, state.corner_orient, state.tips
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    const MOVE_NAMES: [&str; N_MOVES] = ["U", "U'", "L", "L'", "R", "R'", "B", "B'"];

    fn apply_scramble(scramble: &str) -> PyraState {
        let mut tips = [0u8; 4];
        let mut state = PyraState {
            edge_perm: 0,
            edge_orient: 0,
            corner_orient: 0,
            tips: 0,
        };
        for token in scramble.split(' ') {
            if let Some(tip) = TIP_NAMES.iter().position(|name| *name == token) {
                tips[tip / 2] = (tips[tip / 2] + (tip % 2) as u8 + 1) % 3;
            } else {
                state = state.apply(MOVE_NAMES.iter().position(|name| *name == token).unwrap());
            }
        }
        PyraState {
            tips: pack_base3(&tips),
            ..state
        }
    }

    #[test]
    fn coordinates_round_trip() {
        for perm in 0..N_EDGE_PERM {
            assert_eq!(pack_edge_perm(&unpack_edge_perm(perm)), perm);
        }
        for orient in 0..N_EDGE_ORIENT {
            assert_eq!(pack_edge_orient(&unpack_edge_orient(orient)), orient);
        }
        assert_eq!(
            tables().perm_prun.iter().filter(|&&d| d != u8::MAX).count(),
            N_EDGE_PERM / 2
        );
    }

    #[test]
    fn scramble_reaches_the_sampled_state() {
        let mut rng = Rng::seeded(1);
        for _ in 0..300 {
            let (state, scramble) = random(&mut rng);
            assert_eq!(scramble.split(' ').count(), SCRAMBLE_LENGTH + state.unsolved_tips());
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
    fn counts_tips_toward_the_distance() {
        assert!(apply_scramble("U L u l r").solvable_within(5));
        assert!(!apply_scramble("U L u l r b").solvable_within(5));
    }
}
