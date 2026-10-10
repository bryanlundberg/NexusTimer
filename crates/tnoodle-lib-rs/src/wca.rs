use crate::random::Rng;

pub fn generate<S>(
    rng: &mut Rng,
    min_distance: usize,
    mut random: impl FnMut(&mut Rng) -> (S, String),
    solvable_within: impl Fn(&S, usize) -> bool,
) -> (S, String) {
    loop {
        let (state, scramble) = random(rng);
        if !solvable_within(&state, min_distance - 1) {
            return (state, scramble);
        }
    }
}
