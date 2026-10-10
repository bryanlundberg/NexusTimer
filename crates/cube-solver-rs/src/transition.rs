use cube_core::cube::{CubieCube, parity};
use cube_core::search::{Budget, NodeBudget, Outcome};
use cube_core::two_phase;

use crate::cross::SLOTS;
use crate::masked::{self, Goal, Kind, Placement};
use crate::notation::{self, UnknownMove};

const IDENTITY: [u8; 4] = [0, 1, 2, 3];

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum CaseGoal {
    Full,
    Oll,
    OllCp,
    F2l,
}

impl CaseGoal {
    pub fn from_name(name: &str) -> Self {
        match name {
            "oll" => Self::Oll,
            "oll+cp" | "ollcp" | "oll_cp" => Self::OllCp,
            "f2l" => Self::F2l,
            _ => Self::Full,
        }
    }

    fn targets(self, target: &CubieCube) -> Vec<CubieCube> {
        let all = permutations();
        let identity = vec![IDENTITY];
        let corners = if self == Self::Oll { &all } else { &identity };
        let edges = if matches!(self, Self::Oll | Self::OllCp) {
            &all
        } else {
            &identity
        };
        let mut targets = vec![*target];
        for c in corners {
            for e in edges {
                if parity(c) == parity(e) && (*c, *e) != (IDENTITY, IDENTITY) {
                    targets.push(relabel(target, c, e));
                }
            }
        }
        targets
    }
}

fn permutations() -> Vec<[u8; 4]> {
    let mut all = Vec::with_capacity(24);
    for a in 0..4u8 {
        for b in (0..4).filter(|&b| b != a) {
            for c in (0..4).filter(|&c| c != a && c != b) {
                all.push([a, b, c, 6 - a - b - c]);
            }
        }
    }
    all
}

fn relabel(target: &CubieCube, corners: &[u8; 4], edges: &[u8; 4]) -> CubieCube {
    let mut cube = *target;
    for piece in cube.cp.iter_mut().filter(|piece| **piece < 4) {
        *piece = corners[usize::from(*piece)];
    }
    for piece in cube.ep.iter_mut().filter(|piece| **piece < 4) {
        *piece = edges[usize::from(*piece)];
    }
    cube
}

fn f2l_goal(target: &CubieCube) -> Goal {
    let corner = |label| Placement::in_cube(target, Kind::Corner, label);
    let edge = |label| Placement::in_cube(target, Kind::Edge, label);
    let exact = (4..8).map(corner).chain((4..12).map(edge)).collect();
    let mut groups = vec![(4..8).map(edge).collect::<Vec<_>>()];
    groups.extend(
        SLOTS
            .iter()
            .map(|&(c, e, [a, b])| vec![corner(c), edge(e), edge(a), edge(b)]),
    );
    Goal::new(exact, groups)
}

fn descend(cube: &CubieCube, mut best: Vec<usize>, budget: &mut impl Budget) -> Vec<usize> {
    while let Some(limit) = best.len().checked_sub(1) {
        match two_phase::solve_within(cube, limit, budget) {
            Outcome::Found(moves) => best = moves,
            Outcome::NoneWithinLength | Outcome::OutOfBudget => break,
        }
    }
    best
}

fn closest(from: &CubieCube, targets: &[CubieCube], nodes: u64) -> Vec<usize> {
    let differences: Vec<CubieCube> = targets.iter().map(|target| target.inverse().multiply(from)).collect();
    if differences.iter().any(CubieCube::is_solved) {
        return Vec::new();
    }
    let first = two_phase::solve(&differences[0], 21).expect("21 moves always suffice");
    let per_target = nodes / differences.len() as u64;
    differences.iter().fold(first, |best, difference| {
        descend(difference, best, &mut NodeBudget::new(per_target))
    })
}

pub fn shortest(from: &CubieCube, to: &CubieCube, goal: CaseGoal, nodes: u64) -> Vec<usize> {
    if goal != CaseGoal::F2l {
        return closest(from, &goal.targets(to), nodes);
    }
    let exact = closest(from, &[*to], nodes / 4);
    let Some(limit) = exact.len().checked_sub(1) else {
        return exact;
    };
    match masked::solve(from, &f2l_goal(to), limit, &mut NodeBudget::new(nodes - nodes / 4)) {
        Outcome::Found(moves) => moves,
        Outcome::NoneWithinLength | Outcome::OutOfBudget => exact,
    }
}

pub fn transition(history: &str, setup: &str, goal: CaseGoal, nodes: u64) -> Result<Vec<usize>, UnknownMove> {
    Ok(shortest(
        &notation::parse(history)?,
        &notation::parse(setup)?,
        goal,
        nodes,
    ))
}

#[cfg(test)]
mod tests {
    use super::*;
    use cube_core::SplitMix64;
    use cube_core::random::RandomSource;

    const NODES: u64 = 2_000_000;

    fn random_last_layer(rng: &mut SplitMix64, oriented: bool) -> CubieCube {
        let mut cube = CubieCube::SOLVED;
        loop {
            for i in (1..4).rev() {
                cube.cp.swap(i, rng.below_usize(i + 1));
                cube.ep.swap(i, rng.below_usize(i + 1));
            }
            if parity(&cube.cp) == parity(&cube.ep) {
                break;
            }
        }
        if !oriented {
            for i in 0..3 {
                cube.co[i] = rng.below_usize(3) as u8;
                cube.eo[i] = rng.below_usize(2) as u8;
            }
            cube.co[3] = (6 - cube.co[..3].iter().sum::<u8>() % 3) % 3;
            cube.eo[3] = cube.eo[..3].iter().sum::<u8>() % 2;
        }
        cube
    }

    fn same(a: &CubieCube, b: &CubieCube, corners: &[usize], edges: &[usize]) -> bool {
        corners.iter().all(|&l| {
            let pa = a.cp.iter().position(|&p| usize::from(p) == l);
            pa == b.cp.iter().position(|&p| usize::from(p) == l) && a.co[pa.unwrap()] == b.co[pa.unwrap()]
        }) && edges.iter().all(|&l| {
            let pa = a.ep.iter().position(|&p| usize::from(p) == l);
            pa == b.ep.iter().position(|&p| usize::from(p) == l) && a.eo[pa.unwrap()] == b.eo[pa.unwrap()]
        })
    }

    #[test]
    fn full_goal_reaches_the_exact_case() {
        let mut rng = SplitMix64::new(11);
        for _ in 0..20 {
            let from = CubieCube::random(&mut rng);
            let to = random_last_layer(&mut rng, false);
            let moves = shortest(&from, &to, CaseGoal::Full, NODES);
            assert_eq!(from.apply_moves(&moves), to);
            assert!(moves.len() <= 21);
        }
    }

    #[test]
    fn masked_goals_keep_what_the_algorithm_needs() {
        let mut rng = SplitMix64::new(12);
        for _ in 0..12 {
            let from = random_last_layer(&mut rng, true);
            let to = random_last_layer(&mut rng, false);
            for goal in [CaseGoal::Oll, CaseGoal::OllCp, CaseGoal::F2l] {
                let moves = shortest(&from, &to, goal, NODES);
                let end = from.apply_moves(&moves);
                assert!(moves.len() <= 21, "{goal:?}");
                assert!(same(&end, &to, &[4, 5, 6, 7], &(4..12).collect::<Vec<_>>()), "{goal:?}");
                if goal != CaseGoal::F2l {
                    assert_eq!((end.co, end.eo), (to.co, to.eo), "{goal:?}");
                }
                if goal == CaseGoal::OllCp {
                    assert_eq!(end.cp, to.cp);
                }
            }
        }
    }

    #[test]
    fn f2l_cases_with_pieces_out_of_place() {
        let mut rng = SplitMix64::new(13);
        for setup in ["R U R'", "F' U' F U2 R U R'", "R U' R' U R U2 R' U' R U' R'"] {
            let to = notation::parse(setup).unwrap();
            let from = random_last_layer(&mut rng, false);
            let moves = shortest(&from, &to, CaseGoal::F2l, NODES);
            let end = from.apply_moves(&moves);
            assert!(same(&end, &to, &[4, 5, 6, 7], &(4..12).collect::<Vec<_>>()), "{setup}");
        }
    }

    #[test]
    fn nothing_to_do_when_already_there() {
        let to = notation::parse("R U R' U'").unwrap();
        assert!(shortest(&to, &to, CaseGoal::Full, NODES).is_empty());
        assert!(shortest(&to, &to, CaseGoal::Oll, NODES).is_empty());
    }

    #[test]
    fn parses_both_ends() {
        let moves = transition("R U", "R U R' y", CaseGoal::Full, NODES).unwrap();
        let end = notation::parse("R U").unwrap().apply_moves(&moves);
        assert_eq!(end, notation::parse("R U R' y").unwrap());
        assert!(transition("R U", "R Q", CaseGoal::Full, NODES).is_err());
    }
}
