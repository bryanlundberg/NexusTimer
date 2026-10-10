use crate::random::Rng;
use crate::wca;

const PINS: [&str; 9] = ["UR", "DR", "DL", "UL", "U", "R", "D", "L", "ALL"];

const MOVES: [[i8; 18]; 9] = [
    [0, 1, 1, 0, 1, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, -1, 0, 0],
    [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
    [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, -1, 0, -1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 1, 0, 1, 1, -1, 0, 0, 0, 0, 0, -1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, -1, 0, -1],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0, -1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 0, -1, 0, 0, 0, -1, 0, -1],
];

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct Clock([u8; 18]);

impl Clock {
    pub fn solved() -> Clock {
        Clock([0; 18])
    }

    pub fn turn(&mut self, pin: usize, amount: i32) {
        for (dial, step) in self.0.iter_mut().zip(MOVES[pin]) {
            *dial = (i32::from(*dial) + amount * i32::from(step)).rem_euclid(12) as u8;
        }
    }

    pub fn flip(&mut self) {
        let (front, back) = self.0.split_at_mut(9);
        front.swap_with_slice(back);
    }

    pub fn is_solved(&self) -> bool {
        self.0 == [0; 18]
    }

    fn solvable_within(&self, moves: usize) -> bool {
        if self.is_solved() {
            return true;
        }
        moves >= 1
            && (0..PINS.len()).any(|pin| {
                (1..12).any(|amount| {
                    let mut next = *self;
                    next.turn(pin, amount);
                    next.is_solved()
                })
            })
    }
}

fn turn_name(pin: usize, amount: i32) -> String {
    format!("{}{}{}", PINS[pin], amount.abs(), if amount >= 0 { '+' } else { '-' })
}

fn random(rng: &mut Rng) -> (Clock, String) {
    let mut clock = Clock::solved();
    let mut moves = Vec::with_capacity(15);
    for pin in 0..9 {
        let amount = rng.below(12) as i32 - 5;
        clock.turn(pin, amount);
        moves.push(turn_name(pin, amount));
    }
    clock.flip();
    moves.push("y2".to_string());
    for pin in 4..9 {
        let amount = rng.below(12) as i32 - 5;
        clock.turn(pin, amount);
        moves.push(turn_name(pin, amount));
    }
    (clock, moves.join(" "))
}

pub fn generate(rng: &mut Rng) -> (Clock, String) {
    wca::generate(rng, 2, random, Clock::solvable_within)
}

pub fn scramble(rng: &mut Rng) -> String {
    generate(rng).1
}

#[cfg(test)]
mod tests {
    use super::*;

    fn parse(scramble: &str) -> Clock {
        let mut clock = Clock::solved();
        for token in scramble.split(' ') {
            if token == "y2" {
                clock.flip();
                continue;
            }
            let sign = if token.ends_with('+') { 1 } else { -1 };
            let body = &token[..token.len() - 1];
            let digits = body.trim_start_matches(|c: char| c.is_ascii_uppercase());
            let pin = PINS
                .iter()
                .position(|name| *name == &body[..body.len() - digits.len()])
                .unwrap();
            clock.turn(pin, sign * digits.parse::<i32>().unwrap());
        }
        clock
    }

    #[test]
    fn follows_the_wca_format() {
        let mut rng = Rng::seeded(1);
        for _ in 0..500 {
            let scramble = scramble(&mut rng);
            let tokens: Vec<&str> = scramble.split(' ').collect();
            assert_eq!(tokens.len(), 15);
            assert_eq!(tokens[9], "y2");
            let order = PINS.iter().chain(PINS[4..].iter());
            for (token, pin) in tokens.iter().filter(|t| **t != "y2").zip(order) {
                assert!(token.starts_with(pin));
                let amount = &token[pin.len()..token.len() - 1];
                let value: i32 = amount.parse().unwrap();
                if token.ends_with('+') {
                    assert!((0..=6).contains(&value), "{token}");
                } else {
                    assert!((1..=5).contains(&value), "{token}");
                }
            }
        }
    }

    #[test]
    fn scramble_is_never_within_one_move_of_solved() {
        let mut rng = Rng::seeded(2);
        for _ in 0..2000 {
            assert!(!parse(&scramble(&mut rng)).solvable_within(1));
        }
    }

    #[test]
    fn turns_are_uniform() {
        let mut rng = Rng::seeded(3);
        let mut counts = [0u32; 12];
        for _ in 0..1200 {
            for token in scramble(&mut rng).split(' ').filter(|t| *t != "y2") {
                let sign = if token.ends_with('+') { 1 } else { -1 };
                let digits = token[..token.len() - 1].trim_start_matches(|c: char| c.is_ascii_uppercase());
                counts[(sign * digits.parse::<i32>().unwrap() + 5) as usize] += 1;
            }
        }
        assert!(counts.iter().all(|&c| (1200..1600).contains(&c)), "{counts:?}");
    }
}
