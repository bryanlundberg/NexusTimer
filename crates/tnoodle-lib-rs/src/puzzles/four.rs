use super::big::{Turn, canonicalize, parse_turn};
use crate::random::Rng;
use crate::solve::threephase;

const BLD_FIRST: [&str; 6] = ["", "x", "x2", "x'", "z", "z'"];
const BLD_SECOND: [&str; 4] = ["", "y", "y2", "y'"];

pub fn scramble(rng: &mut Rng) -> String {
    canonicalize(threephase::random_state_scramble(rng).into_iter().map(parse_turn))
        .into_iter()
        .map(Turn::name)
        .collect::<Vec<_>>()
        .join(" ")
}

pub fn scramble_bld(rng: &mut Rng) -> String {
    let orientation = rng.below_usize(BLD_FIRST.len() * BLD_SECOND.len());
    let mut scramble = scramble(rng);
    for rotation in [
        BLD_FIRST[orientation / BLD_SECOND.len()],
        BLD_SECOND[orientation % BLD_SECOND.len()],
    ] {
        if !rotation.is_empty() {
            scramble.push(' ');
            scramble.push_str(rotation);
        }
    }
    scramble
}
