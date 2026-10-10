use crate::random::Rng;
use crate::solve::fto3phase::{FtoCubie, scramble_string, solution};
use crate::wca;

const MIN_DISTANCE: usize = 2;

fn random(rng: &mut Rng) -> (FtoCubie, String) {
    let fto = FtoCubie::random(rng);
    (fto, scramble_string(&solution(&fto)))
}

pub fn generate(rng: &mut Rng) -> (FtoCubie, String) {
    wca::generate(rng, MIN_DISTANCE, random, |fto, _| fto.within_one_move())
}

pub fn scramble(rng: &mut Rng) -> String {
    generate(rng).1
}

#[cfg(test)]
mod tests {
    use super::*;

    const NAMES: [&str; 16] = [
        "R", "R'", "L", "L'", "B", "B'", "U", "U'", "D", "D'", "F", "F'", "BR", "BR'", "BL", "BL'",
    ];

    #[test]
    fn scramble_reaches_the_sampled_state() {
        let mut rng = Rng::seeded(1);
        for _ in 0..20 {
            let (fto, scramble) = generate(&mut rng);
            let applied = scramble
                .split(' ')
                .map(|token| NAMES.iter().position(|name| *name == token).expect("fto move"))
                .fold(FtoCubie::solved(), |state, mv| state.turn(mv));
            assert_eq!(applied, fto, "{scramble}");
            assert!(!fto.within_one_move());
        }
    }
}
