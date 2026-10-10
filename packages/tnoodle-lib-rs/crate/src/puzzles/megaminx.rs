use crate::random::Rng;

pub fn scramble(rng: &mut Rng) -> String {
    let lines: Vec<String> = (0..7)
        .map(|_| {
            let mut moves = Vec::with_capacity(11);
            let mut last_plus = true;
            for column in 0..10 {
                last_plus = rng.below(2) == 0;
                let face = if column % 2 == 0 { 'R' } else { 'D' };
                moves.push(format!("{face}{}", if last_plus { "++" } else { "--" }));
            }
            moves.push(if last_plus { "U" } else { "U'" }.to_string());
            moves.join(" ")
        })
        .collect();
    lines.join("\n")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn has_seven_pochmann_lines() {
        let mut rng = Rng::seeded(1);
        for _ in 0..200 {
            let scramble = scramble(&mut rng);
            let lines: Vec<&str> = scramble.split('\n').collect();
            assert_eq!(lines.len(), 7);
            for line in lines {
                let moves: Vec<&str> = line.split(' ').collect();
                assert_eq!(moves.len(), 11);
                for (column, mv) in moves[..10].iter().enumerate() {
                    let face = if column % 2 == 0 { "R" } else { "D" };
                    assert!(*mv == format!("{face}++") || *mv == format!("{face}--"), "{mv}");
                }
                let expected_u = if moves[9].ends_with("++") { "U" } else { "U'" };
                assert_eq!(moves[10], expected_u);
            }
        }
    }
}
