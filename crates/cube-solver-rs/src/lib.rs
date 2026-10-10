mod cross;
mod masked;
mod notation;
mod rotation;
mod transition;

use cube_core::cube::moves_to_string;
use wasm_bindgen::prelude::*;

pub use cross::{CROSS_FACES, FaceHints, hints};
pub use notation::{UnknownMove, apply, parse};
pub use transition::{CaseGoal, shortest, transition};

pub const TRANSITION_NODES: u64 = 2_000_000;

#[wasm_bindgen(js_name = crossHints)]
pub fn cross_hints(scramble: &str) -> Result<Vec<String>, JsError> {
    let faces = hints(scramble).map_err(|error| JsError::new(&error.to_string()))?;
    Ok(faces
        .iter()
        .flat_map(|face| {
            [
                face.face.to_string(),
                face.rotation.to_string(),
                moves_to_string(&face.cross),
            ]
            .into_iter()
            .chain(face.xcross.iter().map(|moves| moves_to_string(moves)))
        })
        .collect())
}

#[wasm_bindgen(js_name = solveTransition)]
pub fn solve_transition(history: &str, setup: &str, goal: &str) -> Result<String, JsError> {
    transition(history, setup, CaseGoal::from_name(goal), TRANSITION_NODES)
        .map(|moves| moves_to_string(&moves))
        .map_err(|error| JsError::new(&error.to_string()))
}
