use std::env;
use std::fs;
use std::path::PathBuf;
use std::time::Instant;
use tnoodle_lib_rs::{Puzzle, Rng, oracle_scramble};

fn main() {
    let mut args = env::args().skip(1);
    let count: usize = args.next().and_then(|arg| arg.parse().ok()).unwrap_or(200);
    let dir = PathBuf::from(args.next().unwrap_or_else(|| "../oracle/out".to_string()));
    let keys: Vec<String> = args.collect();
    fs::create_dir_all(&dir).unwrap();

    let mut rng = Rng::from_entropy();
    for puzzle in Puzzle::ALL
        .into_iter()
        .filter(|p| keys.is_empty() || keys.iter().any(|k| k == p.key()))
    {
        let start = Instant::now();
        let first = oracle_scramble(puzzle, &mut rng);
        let first_ms = start.elapsed().as_secs_f64() * 1000.0;

        let mut times = Vec::with_capacity(count);
        let mut lines = vec![line(first)];
        for _ in 1..count {
            let start = Instant::now();
            let generated = oracle_scramble(puzzle, &mut rng);
            times.push(start.elapsed().as_secs_f64() * 1000.0);
            lines.push(line(generated));
        }
        times.sort_by(f64::total_cmp);
        let at = |q: f64| {
            times
                .get(((times.len() as f64 * q) as usize).min(times.len().saturating_sub(1)))
                .copied()
        };
        let [median, p90, p99, max] = [0.5, 0.9, 0.99, 1.0].map(|q| at(q).unwrap_or(0.0));
        println!(
            "{:<6} first {first_ms:>8.2} ms  median {median:>8.3}  p90 {p90:>8.3}  p99 {p99:>8.2}  max {max:>8.2} ms",
            puzzle.key()
        );

        fs::write(dir.join(format!("{}.txt", puzzle.key())), lines.join("\n") + "\n").unwrap();
    }
}

fn line((scramble, state): (String, Option<String>)) -> String {
    let scramble = scramble.replace('\n', " ");
    match state {
        Some(state) => format!("{scramble}\t{state}"),
        None => scramble,
    }
}
