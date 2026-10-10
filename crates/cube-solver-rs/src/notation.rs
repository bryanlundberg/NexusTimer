use std::fmt;

use cube_core::cube::CubieCube;

use crate::rotation::{Axis, rotate};

const FACES: &str = "URFDLB";

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UnknownMove(pub String);

impl fmt::Display for UnknownMove {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "unknown move: {}", self.0)
    }
}

impl std::error::Error for UnknownMove {}

#[derive(Clone, Copy)]
enum Step {
    Turn(usize, usize),
    Rotate(Axis, usize),
}

fn quarters(suffix: &str) -> Option<usize> {
    match suffix {
        "" => Some(1),
        "'" => Some(3),
        "2" | "2'" | "'2" => Some(2),
        _ => None,
    }
}

fn wide(face: usize, q: usize) -> [Step; 2] {
    let back = 4 - q;
    let rotation = match face {
        0 => Step::Rotate(Axis::Y, q),
        1 => Step::Rotate(Axis::X, q),
        2 => Step::Rotate(Axis::Z, q),
        3 => Step::Rotate(Axis::Y, back),
        4 => Step::Rotate(Axis::X, back),
        _ => Step::Rotate(Axis::Z, back),
    };
    [Step::Turn((face + 3) % 6, q), rotation]
}

fn steps(base: &str, q: usize) -> Option<Vec<Step>> {
    let back = 4 - q;
    let steps = match base {
        "x" => vec![Step::Rotate(Axis::X, q)],
        "y" => vec![Step::Rotate(Axis::Y, q)],
        "z" => vec![Step::Rotate(Axis::Z, q)],
        "M" => vec![Step::Turn(1, q), Step::Turn(4, back), Step::Rotate(Axis::X, back)],
        "E" => vec![Step::Turn(0, q), Step::Turn(3, back), Step::Rotate(Axis::Y, back)],
        "S" => vec![Step::Turn(2, back), Step::Turn(5, q), Step::Rotate(Axis::Z, q)],
        _ => {
            let mut chars = base.chars();
            let letter = chars.next()?;
            let face = FACES.find(letter.to_ascii_uppercase())?;
            match (letter.is_ascii_uppercase(), chars.as_str()) {
                (true, "") => vec![Step::Turn(face, q)],
                (true, "w") | (false, "") => wide(face, q).to_vec(),
                _ => return None,
            }
        }
    };
    Some(steps)
}

fn apply_token(cube: CubieCube, token: &str) -> Result<CubieCube, UnknownMove> {
    let split = token.find(|c: char| !c.is_ascii_alphabetic()).unwrap_or(token.len());
    let (base, suffix) = token.split_at(split);
    let steps = quarters(suffix)
        .and_then(|q| steps(base, q))
        .ok_or_else(|| UnknownMove(token.to_string()))?;
    Ok(steps.into_iter().fold(cube, |cube, step| match step {
        Step::Turn(face, q) => cube.apply_move(face * 3 + q - 1),
        Step::Rotate(axis, q) => rotate(&cube, axis, q),
    }))
}

pub fn apply(cube: CubieCube, alg: &str) -> Result<CubieCube, UnknownMove> {
    alg.split(|c: char| c.is_whitespace() || c == '(' || c == ')')
        .filter(|token| !token.is_empty())
        .try_fold(cube, apply_token)
}

pub fn parse(alg: &str) -> Result<CubieCube, UnknownMove> {
    apply(CubieCube::SOLVED, alg)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn state(alg: &str) -> CubieCube {
        parse(alg).unwrap()
    }

    fn keeps_first_two_layers(alg: &str) -> bool {
        let cube = state(alg);
        (4..8).all(|i| cube.cp[i] == i as u8 && cube.co[i] == 0)
            && (4..12).all(|i| cube.ep[i] == i as u8 && cube.eo[i] == 0)
    }

    #[test]
    fn rotations_relabel_faces_like_a_real_cube() {
        assert_eq!(state("x U x'"), state("F"));
        assert_eq!(state("y R y'"), state("B"));
        assert_eq!(state("y F y'"), state("R"));
        assert_eq!(state("z U z'"), state("L"));
        assert_eq!(state("z R z'"), state("U"));
        assert_eq!(state("x"), CubieCube::SOLVED);
    }

    #[test]
    fn a_rotation_after_a_scramble_renames_its_faces() {
        let scramble = "R U' F2 D L' B R2 U F' D2 L B'";
        let renamed = |map: &[(char, char)]| -> String {
            scramble
                .chars()
                .map(|c| map.iter().find(|(from, _)| *from == c).map_or(c, |(_, to)| *to))
                .collect()
        };
        let z2 = [('U', 'D'), ('D', 'U'), ('R', 'L'), ('L', 'R')];
        let x = [('F', 'U'), ('U', 'B'), ('B', 'D'), ('D', 'F')];
        let z = [('U', 'R'), ('R', 'D'), ('D', 'L'), ('L', 'U')];
        let y = [('R', 'F'), ('F', 'L'), ('L', 'B'), ('B', 'R')];
        assert_eq!(state(&format!("{scramble} z2")), state(&renamed(&z2)));
        assert_eq!(state(&format!("{scramble} x")), state(&renamed(&x)));
        assert_eq!(state(&format!("{scramble} z")), state(&renamed(&z)));
        assert_eq!(state(&format!("{scramble} y")), state(&renamed(&y)));
    }

    #[test]
    fn wide_and_slice_moves_match_their_definitions() {
        assert_eq!(state("r"), state("R M'"));
        assert_eq!(state("Rw2"), state("r2"));
        assert_eq!(state("l"), state("L M"));
        assert_eq!(state("u"), state("U E'"));
        assert_eq!(state("d'"), state("D' E'"));
        assert_eq!(state("f"), state("F S"));
        assert_eq!(state("b"), state("B S'"));
        assert_eq!(state("M2 M2"), CubieCube::SOLVED);
        assert_eq!(state("U E' D'"), CubieCube::SOLVED);
    }

    #[test]
    fn last_layer_algorithms_keep_the_first_two_layers() {
        for alg in [
            "r U R' U R U2 r'",
            "f R U R' U' f'",
            "F R U R' U' S R U R' U' f'",
            "M' U M2 U M2 U M' U2 M2",
            "M2 U M2 U2 M2 U M2",
            "R U R' U' M' U R U' r'",
            "x R' U R' D2 R U' R' D2 R2 x'",
            "S R U R' U' R' F R f'",
            "y' R U' R2 D' r U r' D R2 U R'",
            "R' F R S R' F' R S'",
            "Fw R U R' U' Fw'",
            "Rw U2 R' U' R U' Rw'",
        ] {
            assert!(keeps_first_two_layers(alg), "{alg}");
        }
    }

    #[test]
    fn notation_variants() {
        assert_eq!(state("(R U) R' U'"), state("R U R' U'"));
        assert_eq!(state("R2'"), state("R2"));
        assert_eq!(state("R'2"), state("R2"));
        assert_eq!(state("  "), CubieCube::SOLVED);
        assert_eq!(parse("R U 2R"), Err(UnknownMove("2R".into())));
        assert_eq!(parse("R3"), Err(UnknownMove("R3".into())));
        assert_eq!(parse("rw"), Err(UnknownMove("rw".into())));
        assert_eq!(parse("Q"), Err(UnknownMove("Q".into())));
    }
}
