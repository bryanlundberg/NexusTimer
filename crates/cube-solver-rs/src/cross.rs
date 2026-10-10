use cube_core::cube::CubieCube;
use cube_core::search::{NodeBudget, Outcome};

use crate::masked::{self, Goal, Kind, Placement};
use crate::notation::{self, UnknownMove};

pub const CROSS_FACES: [(char, &str); 6] = [('U', "z2"), ('D', ""), ('F', "x'"), ('B', "x"), ('R', "z"), ('L', "z'")];

pub(crate) const SLOTS: [(u8, u8, [u8; 2]); 4] = [(4, 8, [4, 5]), (5, 9, [5, 6]), (6, 10, [6, 7]), (7, 11, [7, 4])];
const XCROSS_ORDER: [usize; 4] = [1, 2, 3, 0];
const MAX_LENGTH: usize = 16;
const MAX_NODES: u64 = 200_000_000;

pub struct FaceHints {
    pub face: char,
    pub rotation: &'static str,
    pub cross: Vec<usize>,
    pub xcross: Vec<Vec<usize>>,
}

fn edge(label: u8) -> Placement {
    Placement::solved(Kind::Edge, label)
}

fn cross() -> Vec<Placement> {
    (4..8).map(edge).collect()
}

pub fn cross_goal() -> Goal {
    Goal::new(cross(), vec![cross()])
}

pub fn xcross_goal(slot: usize) -> Goal {
    let (corner, slot_edge, [a, b]) = SLOTS[slot];
    let pair = vec![
        Placement::solved(Kind::Corner, corner),
        edge(slot_edge),
        edge(a),
        edge(b),
    ];
    let mut exact = cross();
    exact.extend(&pair[..2]);
    Goal::new(exact, vec![cross(), pair])
}

fn shortest(cube: &CubieCube, goal: &Goal) -> Vec<usize> {
    match masked::solve(cube, goal, MAX_LENGTH, &mut NodeBudget::new(MAX_NODES)) {
        Outcome::Found(moves) => moves,
        Outcome::NoneWithinLength | Outcome::OutOfBudget => Vec::new(),
    }
}

pub fn hints(scramble: &str) -> Result<Vec<FaceHints>, UnknownMove> {
    let scrambled = notation::parse(scramble)?;
    let cross = cross_goal();
    let xcross: Vec<Goal> = XCROSS_ORDER.iter().map(|&slot| xcross_goal(slot)).collect();
    CROSS_FACES
        .iter()
        .map(|&(face, rotation)| {
            let cube = notation::apply(scrambled, rotation)?;
            Ok(FaceHints {
                face,
                rotation,
                cross: shortest(&cube, &cross),
                xcross: xcross.iter().map(|goal| shortest(&cube, goal)).collect(),
            })
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn solves(cube: &CubieCube, rotation: &str, moves: &[usize], pieces: &[(Kind, u8)]) -> bool {
        let end = notation::apply(*cube, rotation).unwrap().apply_moves(moves);
        pieces.iter().all(|&(kind, label)| match kind {
            Kind::Corner => end.cp[usize::from(label)] == label && end.co[usize::from(label)] == 0,
            Kind::Edge => end.ep[usize::from(label)] == label && end.eo[usize::from(label)] == 0,
        })
    }

    #[test]
    fn every_hint_solves_its_cross_and_slot() {
        let scramble = "D2 R B U D R L U2 F' U2 R F2 R2 B2 R' L2 D2 F2 R' F2 U2";
        let cube = notation::parse(scramble).unwrap();
        let faces = hints(scramble).unwrap();
        assert_eq!(faces.len(), 6);
        let cross_pieces: Vec<(Kind, u8)> = (4..8).map(|l| (Kind::Edge, l)).collect();
        for face in &faces {
            assert!(!face.cross.is_empty());
            assert!(face.cross.len() <= 8);
            assert!(solves(&cube, face.rotation, &face.cross, &cross_pieces));
            for (index, moves) in face.xcross.iter().enumerate() {
                let (corner, slot_edge, _) = SLOTS[XCROSS_ORDER[index]];
                let mut pieces = cross_pieces.clone();
                pieces.extend([(Kind::Corner, corner), (Kind::Edge, slot_edge)]);
                assert!(
                    solves(&cube, face.rotation, moves, &pieces),
                    "{} slot {index}",
                    face.face
                );
                assert!(moves.len() >= face.cross.len());
            }
        }
    }

    #[test]
    fn rejects_unknown_notation() {
        assert!(hints("R U Q").is_err());
    }

    #[test]
    fn a_solved_cross_needs_no_moves() {
        let faces = hints("U").unwrap();
        let length = |face: char| faces.iter().find(|f| f.face == face).unwrap().cross.len();
        assert_eq!(length('D'), 0);
        assert_eq!(length('U'), 1);
        assert!(hints("").unwrap().iter().all(|f| f.cross.is_empty()));
    }
}
