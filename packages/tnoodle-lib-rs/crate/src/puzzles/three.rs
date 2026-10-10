use crate::random::Rng;
use crate::solve::cube::{CubieCube, invert_moves, moves_to_string};
use crate::solve::two_phase;
use crate::wca;

const MAX_LENGTH: usize = 21;
const MIN_DISTANCE: usize = 2;
const BLD_FIRST: [Option<(&str, usize)>; 6] = [
    None,
    Some(("Rw", 1)),
    Some(("Rw2", 1)),
    Some(("Rw'", 1)),
    Some(("Fw", 2)),
    Some(("Fw'", 2)),
];
const BLD_SECOND: [Option<(&str, usize)>; 4] = [None, Some(("Uw", 0)), Some(("Uw2", 0)), Some(("Uw'", 0))];

fn solvable_within(cube: &CubieCube, moves: usize) -> bool {
    cube.is_solved() || (moves >= 1 && cube.within_one_move())
}

fn scramble_for(cube: &CubieCube, forbidden_last_axis: Option<usize>) -> String {
    let solution =
        two_phase::solve_avoiding_first_axis(cube, MAX_LENGTH, forbidden_last_axis).expect("21 moves always suffice");
    moves_to_string(&invert_moves(&solution))
}

fn random(rng: &mut Rng) -> (CubieCube, String) {
    let cube = CubieCube::random(rng);
    let scramble = scramble_for(&cube, None);
    (cube, scramble)
}

fn random_bld(rng: &mut Rng) -> (CubieCube, String) {
    let orientation = rng.below_usize(BLD_FIRST.len() * BLD_SECOND.len());
    let moves: Vec<(&str, usize)> = [
        BLD_FIRST[orientation / BLD_SECOND.len()],
        BLD_SECOND[orientation % BLD_SECOND.len()],
    ]
    .into_iter()
    .flatten()
    .collect();
    let cube = CubieCube::random(rng);
    let mut scramble = scramble_for(&cube, moves.first().map(|&(_, axis)| axis));
    for (name, _) in moves {
        scramble.push(' ');
        scramble.push_str(name);
    }
    (cube, scramble)
}

pub fn generate(rng: &mut Rng) -> (CubieCube, String) {
    wca::generate(rng, MIN_DISTANCE, random, solvable_within)
}

pub fn generate_bld(rng: &mut Rng) -> (CubieCube, String) {
    wca::generate(rng, MIN_DISTANCE, random_bld, solvable_within)
}

pub fn scramble(rng: &mut Rng) -> String {
    generate(rng).1
}

pub fn scramble_bld(rng: &mut Rng) -> String {
    generate_bld(rng).1
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::solve::cube::MOVE_NAMES;

    fn apply(scramble: &str) -> CubieCube {
        scramble
            .split(' ')
            .filter(|token| !token.contains('w'))
            .fold(CubieCube::SOLVED, |cube, token| {
                cube.apply_move(MOVE_NAMES.iter().position(|n| *n == token).unwrap())
            })
    }

    #[test]
    fn scramble_reaches_the_sampled_state_within_21_moves() {
        let mut rng = Rng::seeded(1);
        for _ in 0..200 {
            let (cube, scramble) = generate(&mut rng);
            assert!(scramble.split(' ').count() <= MAX_LENGTH);
            assert_eq!(apply(&scramble), cube);
            assert!(!cube.within_one_move());
        }
    }

    #[test]
    fn bld_appends_a_random_orientation_on_a_different_axis() {
        let mut rng = Rng::seeded(2);
        let mut orientations = std::collections::HashSet::new();
        for _ in 0..600 {
            let (cube, scramble) = generate_bld(&mut rng);
            assert_eq!(apply(&scramble), cube);
            let tokens: Vec<&str> = scramble.split(' ').collect();
            let wide: Vec<&str> = tokens.iter().copied().filter(|t| t.contains('w')).collect();
            orientations.insert(wide.join(" "));
            if let Some(first_wide) = wide.first() {
                let face_turns = tokens.len() - wide.len();
                let last_face = tokens[face_turns - 1].chars().next().unwrap();
                let axis = |c: char| "URFDLB".find(c).unwrap() % 3;
                assert_ne!(axis(last_face), axis(first_wide.chars().next().unwrap()), "{scramble}");
                assert!(tokens[face_turns..].iter().all(|t| t.contains('w')));
            }
        }
        assert_eq!(orientations.len(), 24);
    }
}
