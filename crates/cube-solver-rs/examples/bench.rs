use std::time::Instant;

use cube_core::cube::{CubieCube, parity};
use cube_core::random::RandomSource;
use cube_core::{SplitMix64, two_phase};
use cube_solver_rs::{CaseGoal, TRANSITION_NODES, hints, parse, shortest};

const F2L_CASES: [&str; 8] = [
    "R U R'",
    "R U' R' U R U R'",
    "F' U' F",
    "R U2 R' U' R U R'",
    "R U' R' U2 F' U' F",
    "R U R' U' R U R' U' R U R'",
    "F' U F U2 R U R'",
    "R U' R' U R U' R' U2 R U' R'",
];

fn last_layer(rng: &mut SplitMix64, corners_solved: bool, oriented: bool) -> CubieCube {
    let mut cube = CubieCube::SOLVED;
    loop {
        for i in (1..4).rev() {
            if !corners_solved {
                cube.cp.swap(i, rng.below_usize(i + 1));
            }
            cube.ep.swap(i, rng.below_usize(i + 1));
        }
        if parity(&cube.cp) == parity(&cube.ep) {
            break;
        }
    }
    if !oriented {
        for i in 0..3 {
            if !corners_solved {
                cube.co[i] = rng.below_usize(3) as u8;
            }
            cube.eo[i] = rng.below_usize(2) as u8;
        }
        cube.co[3] = (6 - cube.co[..3].iter().sum::<u8>() % 3) % 3;
        cube.eo[3] = cube.eo[..3].iter().sum::<u8>() % 2;
    }
    cube
}

fn report(name: &str, lengths: &[usize], times: &mut [f64]) {
    times.sort_by(f64::total_cmp);
    let mean = lengths.iter().sum::<usize>() as f64 / lengths.len() as f64;
    println!(
        "{name:<26} mean {mean:>5.2} moves, max {:>2} | median {:>6.1} ms, max {:>6.1} ms",
        lengths.iter().max().unwrap(),
        times[times.len() / 2],
        times[times.len() - 1]
    );
}

fn main() {
    let samples: usize = std::env::args().nth(1).and_then(|n| n.parse().ok()).unwrap_or(40);
    let nodes: u64 = std::env::args()
        .nth(2)
        .and_then(|n| n.parse().ok())
        .unwrap_or(TRANSITION_NODES);
    let mut rng = SplitMix64::new(2026);

    let start = Instant::now();
    two_phase::solve(&CubieCube::SOLVED.apply_move(0), 21);
    hints("").unwrap();
    println!("tables {:.0} ms", start.elapsed().as_secs_f64() * 1e3);

    let mut times = Vec::new();
    for _ in 0..samples {
        let cube = CubieCube::random(&mut rng);
        let solution = two_phase::solve(&cube, 21).unwrap();
        let scramble = cube_core::cube::moves_to_string(&cube_core::cube::invert_moves(&solution));
        let start = Instant::now();
        hints(&scramble).unwrap();
        times.push(start.elapsed().as_secs_f64() * 1e3);
    }
    times.sort_by(f64::total_cmp);
    println!(
        "hints (6 crosses, 24 xcrosses) median {:.1} ms, max {:.1} ms",
        times[times.len() / 2],
        times[times.len() - 1]
    );

    type Case = fn(&mut SplitMix64) -> (CubieCube, CubieCube);
    let cases: [(&str, CaseGoal, Case); 4] = [
        ("full (PLL, ZBLL)", CaseGoal::Full, |rng| {
            (last_layer(rng, false, false), last_layer(rng, false, false))
        }),
        ("oll (OLL, VLS, WV, ...)", CaseGoal::Oll, |rng| {
            (last_layer(rng, false, true), last_layer(rng, false, false))
        }),
        ("oll+cp (COLL)", CaseGoal::OllCp, |rng| {
            (last_layer(rng, true, true), last_layer(rng, false, false))
        }),
        ("f2l (F2L)", CaseGoal::F2l, |rng| {
            let setup = F2L_CASES[rng.below_usize(F2L_CASES.len())];
            (last_layer(rng, false, false), parse(setup).unwrap())
        }),
    ];
    for (name, goal, case) in cases {
        let mut exact = Vec::new();
        let mut lengths = Vec::new();
        let mut times = Vec::new();
        for _ in 0..samples {
            let (from, to) = case(&mut rng);
            exact.push(shortest(&from, &to, CaseGoal::Full, nodes).len());
            let start = Instant::now();
            lengths.push(shortest(&from, &to, goal, nodes).len());
            times.push(start.elapsed().as_secs_f64() * 1e3);
        }
        let exact_mean = exact.iter().sum::<usize>() as f64 / exact.len() as f64;
        report(name, &lengths, &mut times);
        println!("{:<26} exact target mean {exact_mean:.2}", "");
    }
}
