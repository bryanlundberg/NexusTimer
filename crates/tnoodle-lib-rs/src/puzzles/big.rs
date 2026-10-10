use crate::random::Rng;

const FACES: [char; 6] = ['R', 'U', 'F', 'L', 'D', 'B'];
const SUFFIX: [&str; 3] = ["", "2", "'"];

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct Turn {
    pub face: usize,
    pub depth: usize,
    pub amount: usize,
}

impl Turn {
    pub fn name(self) -> String {
        let face = FACES[self.face];
        let layers = match self.depth {
            0 => face.to_string(),
            1 => format!("{face}w"),
            depth => format!("{}{face}w", depth + 1),
        };
        format!("{layers}{}", SUFFIX[self.amount - 1])
    }

    fn axis(self) -> usize {
        self.face % 3
    }
}

pub fn parse_turn(name: &str) -> Turn {
    let digits: String = name.chars().take_while(char::is_ascii_digit).collect();
    let rest = &name[digits.len()..];
    let face = FACES.iter().position(|f| rest.starts_with(*f)).expect("face turn");
    let wide = rest[1..].starts_with('w');
    let depth = match (digits.parse::<usize>(), wide) {
        (Ok(layers), _) => layers - 1,
        (Err(_), true) => 1,
        (Err(_), false) => 0,
    };
    let amount = if rest.ends_with('2') {
        2
    } else if rest.ends_with('\'') {
        3
    } else {
        1
    };
    Turn { face, depth, amount }
}

pub fn canonicalize(turns: impl IntoIterator<Item = Turn>) -> Vec<Turn> {
    let mut result: Vec<Turn> = Vec::new();
    for turn in turns {
        let mut merged = false;
        for i in (0..result.len()).rev() {
            if result[i].axis() != turn.axis() {
                break;
            }
            if result[i].face == turn.face && result[i].depth == turn.depth {
                let amount = (result[i].amount + turn.amount) % 4;
                if amount == 0 {
                    result.remove(i);
                } else {
                    result[i].amount = amount;
                }
                merged = true;
                break;
            }
        }
        if !merged {
            result.push(turn);
        }
    }
    result
}

pub fn scramble_layers(size: usize) -> Vec<(usize, usize)> {
    let mut layers = Vec::new();
    for depth in 0..size / 2 {
        for face in 0..6 {
            if size.is_multiple_of(2) && depth == size / 2 - 1 && face >= 3 {
                continue;
            }
            layers.push((face, depth));
        }
    }
    layers
}

pub fn is_redundant(sequence: &[Turn], face: usize, depth: usize) -> bool {
    for previous in sequence.iter().rev() {
        if previous.axis() != face % 3 {
            return false;
        }
        if previous.face == face && previous.depth == depth {
            return true;
        }
    }
    false
}

pub fn random_turns(size: usize, length: usize, rng: &mut Rng) -> Vec<Turn> {
    let layers = scramble_layers(size);
    let mut sequence: Vec<Turn> = Vec::with_capacity(length);
    let mut allowed = Vec::with_capacity(layers.len());
    while sequence.len() < length {
        allowed.clear();
        allowed.extend(
            layers
                .iter()
                .copied()
                .filter(|&(face, depth)| !is_redundant(&sequence, face, depth)),
        );
        let (face, depth) = allowed[rng.below_usize(allowed.len())];
        let amount = rng.below(3) as usize + 1;
        sequence.push(Turn { face, depth, amount });
    }
    sequence
}

pub fn scramble(size: usize, rng: &mut Rng) -> String {
    let length = match size {
        5 => 60,
        6 => 80,
        7 => 100,
        _ => unreachable!("no random move scramble for size {size}"),
    };
    random_turns(size, length, rng)
        .into_iter()
        .map(Turn::name)
        .collect::<Vec<_>>()
        .join(" ")
}

#[cfg(test)]
mod tests {
    use super::*;

    fn parse(token: &str) -> (usize, usize) {
        let digits: String = token.chars().take_while(char::is_ascii_digit).collect();
        let rest = &token[digits.len()..];
        let face = FACES.iter().position(|f| rest.starts_with(*f)).unwrap();
        let wide = rest[1..].starts_with('w');
        let depth = if !digits.is_empty() {
            digits.parse::<usize>().unwrap() - 1
        } else if wide {
            1
        } else {
            0
        };
        (face, depth)
    }

    #[test]
    fn uses_the_wca_move_set_and_length() {
        let mut rng = Rng::seeded(1);
        for (size, length, expected_layers) in [(5, 60, 12), (6, 80, 15), (7, 100, 18)] {
            assert_eq!(scramble_layers(size).len(), expected_layers);
            for _ in 0..100 {
                let scramble = scramble(size, &mut rng);
                let tokens: Vec<&str> = scramble.split(' ').collect();
                assert_eq!(tokens.len(), length);
                for token in &tokens {
                    let layer = parse(token);
                    assert!(scramble_layers(size).contains(&layer), "{token} on {size}");
                }
            }
        }
    }

    #[test]
    fn never_repeats_a_layer_within_a_commuting_block() {
        let mut rng = Rng::seeded(2);
        for size in [5, 6, 7] {
            for _ in 0..100 {
                let scramble = scramble(size, &mut rng);
                let layers: Vec<(usize, usize)> = scramble.split(' ').map(parse).collect();
                for (i, &(face, depth)) in layers.iter().enumerate() {
                    for &(prev_face, prev_depth) in layers[..i].iter().rev() {
                        if prev_face % 3 != face % 3 {
                            break;
                        }
                        assert!(!(prev_face == face && prev_depth == depth), "{scramble}");
                    }
                }
            }
        }
    }

    #[test]
    fn canonicalize_merges_layers_within_an_axis_block() {
        let turns = ["R", "L", "R'", "Uw", "Uw", "D", "F", "F'"].map(parse_turn);
        let names: Vec<String> = canonicalize(turns).into_iter().map(Turn::name).collect();
        assert_eq!(names, ["L", "Uw2", "D"]);
        assert_eq!(
            parse_turn("3Rw'"),
            Turn {
                face: 0,
                depth: 2,
                amount: 3
            }
        );
    }

    #[test]
    fn even_cubes_skip_half_depth_wide_moves_on_l_d_b() {
        assert!(!scramble_layers(6).contains(&(3, 2)));
        assert!(scramble_layers(6).contains(&(0, 2)));
        assert_eq!(
            Turn {
                face: 0,
                depth: 2,
                amount: 2
            }
            .name(),
            "3Rw2"
        );
        assert_eq!(
            Turn {
                face: 5,
                depth: 1,
                amount: 3
            }
            .name(),
            "Bw'"
        );
    }
}
