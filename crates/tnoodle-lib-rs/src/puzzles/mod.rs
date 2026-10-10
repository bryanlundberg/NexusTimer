mod big;
mod clock;
mod four;
mod fto;
mod megaminx;
mod pyraminx;
mod skewb;
mod sq1;
mod three;
mod two;

use crate::random::Rng;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Puzzle {
    Two,
    Three,
    ThreeBld,
    Four,
    FourBld,
    Five,
    Six,
    Seven,
    Pyraminx,
    Sq1,
    Megaminx,
    Clock,
    Skewb,
    Fto,
}

impl Puzzle {
    pub const ALL: [Puzzle; 14] = [
        Puzzle::Two,
        Puzzle::Three,
        Puzzle::ThreeBld,
        Puzzle::Four,
        Puzzle::FourBld,
        Puzzle::Five,
        Puzzle::Six,
        Puzzle::Seven,
        Puzzle::Pyraminx,
        Puzzle::Sq1,
        Puzzle::Megaminx,
        Puzzle::Clock,
        Puzzle::Skewb,
        Puzzle::Fto,
    ];

    pub fn key(self) -> &'static str {
        match self {
            Puzzle::Two => "222",
            Puzzle::Three => "333",
            Puzzle::ThreeBld => "333ni",
            Puzzle::Four => "444",
            Puzzle::FourBld => "444ni",
            Puzzle::Five => "555",
            Puzzle::Six => "666",
            Puzzle::Seven => "777",
            Puzzle::Pyraminx => "pyram",
            Puzzle::Sq1 => "sq1",
            Puzzle::Megaminx => "minx",
            Puzzle::Clock => "clock",
            Puzzle::Skewb => "skewb",
            Puzzle::Fto => "fto",
        }
    }

    pub fn from_key(key: &str) -> Option<Puzzle> {
        Puzzle::ALL.into_iter().find(|puzzle| puzzle.key() == key)
    }

    pub fn scramble(self, rng: &mut Rng) -> String {
        match self {
            Puzzle::Two => two::scramble(rng),
            Puzzle::Three => three::scramble(rng),
            Puzzle::ThreeBld => three::scramble_bld(rng),
            Puzzle::Four => four::scramble(rng),
            Puzzle::FourBld => four::scramble_bld(rng),
            Puzzle::Five => big::scramble(5, rng),
            Puzzle::Six => big::scramble(6, rng),
            Puzzle::Seven => big::scramble(7, rng),
            Puzzle::Megaminx => megaminx::scramble(rng),
            Puzzle::Clock => clock::scramble(rng),
            Puzzle::Pyraminx => pyraminx::scramble(rng),
            Puzzle::Skewb => skewb::scramble(rng),
            Puzzle::Sq1 => sq1::scramble(rng),
            Puzzle::Fto => fto::scramble(rng),
        }
    }
}

#[cfg(feature = "oracle")]
pub fn oracle_scramble(puzzle: Puzzle, rng: &mut Rng) -> (String, Option<String>) {
    match puzzle {
        Puzzle::Two => {
            let (state, scramble) = two::generate(rng);
            (scramble, Some(two::describe(&state)))
        }
        Puzzle::Three => {
            let (cube, scramble) = three::generate(rng);
            (scramble, Some(cube.facelets()))
        }
        Puzzle::ThreeBld => {
            let (cube, scramble) = three::generate_bld(rng);
            (scramble, Some(cube.facelets()))
        }
        Puzzle::Pyraminx => {
            let (state, scramble) = pyraminx::generate(rng);
            (scramble, Some(pyraminx::describe(&state)))
        }
        Puzzle::Skewb => {
            let (state, scramble) = skewb::generate(rng);
            (scramble, Some(skewb::describe(&state)))
        }
        Puzzle::Sq1 => {
            let (cube, scramble) = sq1::generate(rng);
            (scramble, Some(sq1::describe(&cube)))
        }
        Puzzle::Fto => {
            let (fto, scramble) = fto::generate(rng);
            (scramble, Some(fto.describe()))
        }
        _ => (puzzle.scramble(rng), None),
    }
}
