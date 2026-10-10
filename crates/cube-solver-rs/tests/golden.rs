use std::collections::HashMap;

use cube_core::cube::CubieCube;
use cube_solver_rs::{CaseGoal, TRANSITION_NODES, apply, hints, parse, shortest};
use serde::Deserialize;

#[derive(Deserialize)]
struct Fixture {
    hints: Vec<HintCase>,
    kociemba: Vec<KociembaCase>,
}

#[derive(Deserialize)]
struct HintCase {
    scramble: String,
    faces: HashMap<char, FaceCase>,
}

#[derive(Deserialize)]
struct FaceCase {
    cross: String,
    xcross: Vec<String>,
}

#[derive(Deserialize)]
struct KociembaCase {
    state: String,
    solution: String,
}

fn fixture() -> Fixture {
    let raw = include_str!("fixtures/cube-solver-2.4.1.json");
    serde_json::from_str(raw).expect("valid fixture")
}

fn length(moves: &str) -> usize {
    moves.split_whitespace().count()
}

const LEGACY_SLOTS: [(usize, usize); 4] = [(5, 9), (6, 10), (7, 11), (4, 8)];

fn solves(start: &CubieCube, moves: &[usize], slot: Option<(usize, usize)>) -> bool {
    let end = start.apply_moves(moves);
    let cross = (4..8).all(|i| end.ep[i] == i as u8 && end.eo[i] == 0);
    cross
        && slot.is_none_or(|(corner, edge)| {
            end.cp[corner] == corner as u8 && end.co[corner] == 0 && end.ep[edge] == edge as u8 && end.eo[edge] == 0
        })
}

#[test]
fn hints_are_valid_and_never_longer_than_cube_solver() {
    let mut shorter = 0;
    for case in fixture().hints {
        let scrambled = parse(&case.scramble).unwrap();
        for face in hints(&case.scramble).unwrap() {
            let start = apply(scrambled, face.rotation).unwrap();
            let reference = &case.faces[&face.face];
            let theirs = length(&reference.cross);
            assert!(face.cross.len() <= theirs, "{} cross {}", face.face, case.scramble);
            assert!(solves(&start, &face.cross, None));
            shorter += usize::from(face.cross.len() < theirs);
            for (index, moves) in face.xcross.iter().enumerate() {
                let theirs = length(&reference.xcross[index]);
                assert!(moves.len() <= theirs, "{} xcross {index} {}", face.face, case.scramble);
                assert!(solves(&start, moves, Some(LEGACY_SLOTS[index])));
                shorter += usize::from(moves.len() < theirs);
            }
        }
    }
    assert!(shorter > 0);
}

#[test]
fn transitions_are_never_longer_than_cube_solver() {
    let mut ours_total = 0;
    let mut theirs_total = 0;
    for case in fixture().kociemba {
        let state = parse(&case.state).unwrap();
        let reference = parse(&format!("{} {}", case.state, case.solution)).unwrap();
        assert!(reference.is_solved(), "{}", case.state);
        let moves = shortest(&state, &CubieCube::SOLVED, CaseGoal::Full, TRANSITION_NODES);
        assert!(state.apply_moves(&moves).is_solved());
        assert!(moves.len() <= length(&case.solution), "{}", case.state);
        ours_total += moves.len();
        theirs_total += length(&case.solution);
    }
    assert!(ours_total * 10 < theirs_total * 8, "{ours_total} vs {theirs_total}");
}
