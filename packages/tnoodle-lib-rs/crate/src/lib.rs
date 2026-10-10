mod puzzles;
mod random;
mod solve;
mod wca;

pub use puzzles::Puzzle;
pub use random::Rng;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn scramble(puzzle: &str) -> Result<String, JsError> {
    let puzzle = Puzzle::from_key(puzzle).ok_or_else(|| JsError::new(&format!("unknown puzzle: {puzzle}")))?;
    Ok(puzzle.scramble(&mut Rng::from_entropy()))
}

#[cfg(feature = "oracle")]
pub use puzzles::oracle_scramble;
