use std::sync::OnceLock;

use cube_core::cube::CubieCube;
use cube_core::symmetry::ROTATE_U4;
use cube_core::two_phase::ROTATE_URF;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Axis {
    X,
    Y,
    Z,
}

const U: usize = 0;
const R: usize = 1;
const F: usize = 2;
const D: usize = 3;
const L: usize = 4;

struct Rotations {
    quarter: [CubieCube; 3],
    inverse: [CubieCube; 3],
}

fn face_turn(face: usize) -> CubieCube {
    CubieCube::SOLVED.apply_move(face * 3)
}

fn turns_face_into(rotation: &CubieCube, logical: usize, physical: usize) -> bool {
    rotation.multiply(&face_turn(logical)).multiply(&rotation.inverse()) == face_turn(physical)
}

fn whole_cube_rotations() -> Vec<CubieCube> {
    let mut rotations = vec![CubieCube::SOLVED];
    let mut next = 0;
    while next < rotations.len() {
        for generator in [ROTATE_U4, ROTATE_URF] {
            let rotation = rotations[next].multiply(&generator);
            if !rotations.contains(&rotation) {
                rotations.push(rotation);
            }
        }
        next += 1;
    }
    rotations
}

fn rotations() -> &'static Rotations {
    static ROTATIONS: OnceLock<Rotations> = OnceLock::new();
    ROTATIONS.get_or_init(|| {
        let all = whole_cube_rotations();
        let find = |first: (usize, usize), second: (usize, usize)| {
            *all.iter()
                .find(|r| turns_face_into(r, first.0, first.1) && turns_face_into(r, second.0, second.1))
                .expect("every quarter rotation is a whole-cube rotation")
        };
        let quarter = [find((U, F), (F, D)), find((F, R), (U, U)), find((U, L), (F, F))];
        Rotations {
            quarter,
            inverse: quarter.map(|rotation| rotation.inverse()),
        }
    })
}

pub fn rotate(cube: &CubieCube, axis: Axis, quarters: usize) -> CubieCube {
    let rotations = rotations();
    let axis = axis as usize;
    (0..quarters % 4).fold(*cube, |cube, _| {
        rotations.inverse[axis]
            .multiply(&cube)
            .multiply(&rotations.quarter[axis])
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn generators_span_the_24_rotations() {
        assert_eq!(whole_cube_rotations().len(), 24);
    }

    #[test]
    fn four_quarters_are_identity() {
        let cube = CubieCube::SOLVED.apply_move(3).apply_move(0).apply_move(8);
        for axis in [Axis::X, Axis::Y, Axis::Z] {
            assert_eq!(rotate(&cube, axis, 4), cube);
            assert_ne!(rotate(&cube, axis, 1), cube);
        }
    }
}
