use crate::random::Rng;
use crate::solve::sq12phase::{FullCube, Search, scramble_string};
use crate::wca;

const MIN_DISTANCE: usize = 11;

fn random(rng: &mut Rng) -> (FullCube, String) {
    let cube = FullCube::random(rng);
    let solution = Search::new(cube).solution();
    (cube, scramble_string(&solution))
}

pub fn generate(rng: &mut Rng) -> (FullCube, String) {
    wca::generate(rng, MIN_DISTANCE, random, Search::within_or_unknown)
}

pub fn scramble(rng: &mut Rng) -> String {
    generate(rng).1
}

#[cfg(feature = "oracle")]
pub fn describe(cube: &FullCube) -> String {
    format!(
        "{:06x},{:06x},{:06x},{:06x},{}",
        cube.ul, cube.ur, cube.dl, cube.dr, cube.ml
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    fn apply(scramble: &str) -> FullCube {
        let mut cube = FullCube::SOLVED;
        for token in scramble.split(' ') {
            if token == "/" {
                cube.do_move(0);
                continue;
            }
            let (top, bottom) = token.trim_matches(|c| c == '(' || c == ')').split_once(',').unwrap();
            let (top, bottom): (i32, i32) = (top.parse().unwrap(), bottom.parse().unwrap());
            assert!((-5..=6).contains(&top) && (-5..=6).contains(&bottom), "{token}");
            assert!(top != 0 || bottom != 0, "{token}");
            if top != 0 {
                cube.do_move(top.rem_euclid(12));
            }
            if bottom != 0 {
                cube.do_move(-bottom.rem_euclid(12));
            }
        }
        cube
    }

    #[test]
    fn scramble_reaches_the_sampled_state() {
        let mut rng = Rng::seeded(1);
        for _ in 0..200 {
            let (cube, scramble) = generate(&mut rng);
            assert_eq!(apply(&scramble), cube, "{scramble}");
            assert!(!Search::within_or_unknown(&cube, MIN_DISTANCE - 1));
        }
    }

    #[test]
    fn detects_states_close_to_solved() {
        assert!(Search::within_or_unknown(&apply("(1,0) / (3,0) /"), 10));
        assert!(Search::within_or_unknown(&FullCube::SOLVED, 0));
    }
}
