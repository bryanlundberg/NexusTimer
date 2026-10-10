pub mod cube;
pub mod fto3phase;
pub mod sq12phase;
pub mod symmetry;
pub mod threephase;
pub mod two_phase;

use symmetry::SymCoordinate;

fn contains_byte(block: &[u8], value: u8) -> bool {
    let Ok(bytes) = <[u8; 8]>::try_from(block) else {
        return true;
    };
    let word = u64::from_le_bytes(bytes) ^ (u64::from(value) * 0x0101_0101_0101_0101);
    word.wrapping_sub(0x0101_0101_0101_0101) & !word & 0x8080_8080_8080_8080 != 0
}

pub fn breadth_first(
    size: usize,
    starts: &[usize],
    moves: &[usize],
    neighbor: impl Fn(usize, usize) -> usize,
) -> Vec<u8> {
    let mut distance = vec![u8::MAX; size];
    for &start in starts {
        distance[start] = 0;
    }
    let mut visited = starts.len();
    let mut depth = 0u8;
    while visited < size {
        let backward = visited > size / 2;
        let wanted = if backward { u8::MAX } else { depth };
        let mut found = 0;
        for block in (0..size).step_by(8) {
            let end = (block + 8).min(size);
            if !contains_byte(&distance[block..end], wanted) {
                continue;
            }
            for index in block..end {
                if backward {
                    if distance[index] == u8::MAX && moves.iter().any(|&mv| distance[neighbor(index, mv)] == depth) {
                        distance[index] = depth + 1;
                        found += 1;
                    }
                } else if distance[index] == depth {
                    for &mv in moves {
                        let target = neighbor(index, mv);
                        if distance[target] == u8::MAX {
                            distance[target] = depth + 1;
                            found += 1;
                        }
                    }
                }
            }
        }
        if found == 0 {
            break;
        }
        visited += found;
        depth += 1;
    }
    distance
}

#[cfg(test)]
pub fn distance_table<const M: usize>(outer: &[[u16; M]], inner: &[[u16; M]]) -> Vec<u8> {
    let width = inner.len();
    let moves: [usize; M] = std::array::from_fn(|mv| mv);
    breadth_first(outer.len() * width, &[0], &moves, |index, mv| {
        usize::from(outer[index / width][mv]) * width + usize::from(inner[index % width][mv])
    })
}

pub fn sym_distance_table<const M: usize>(
    outer: &SymCoordinate,
    outer_move: &[[u16; M]],
    inner_move: &[[u16; M]],
    inner_conj: &[u16],
    syms: usize,
) -> Vec<u8> {
    let width = inner_move.len();
    let classes = outer.reps.len();
    let size = classes * width;
    let transitions: Vec<[(u32, u8); M]> = outer
        .reps
        .iter()
        .map(|&rep| {
            std::array::from_fn(|mv| {
                let (class, sym) = outer.class(usize::from(outer_move[rep as usize][mv]));
                ((class * width) as u32, sym as u8)
            })
        })
        .collect();
    let neighbor = |row: &[(u32, u8); M], inner: usize, mv: usize| {
        let (base, sym) = row[mv];
        base as usize + usize::from(inner_conj[usize::from(inner_move[inner][mv]) * syms + usize::from(sym)])
    };
    let mark = |distance: &mut [u8], class: usize, inner: usize, value: u8| {
        let stabilizer = outer.stabilizers[class];
        if stabilizer == 1 {
            let index = class * width + inner;
            if distance[index] == u8::MAX {
                distance[index] = value;
                return 1;
            }
            return 0;
        }
        let mut marked = 0;
        for position in 0..syms {
            if stabilizer & (1 << position) == 0 {
                continue;
            }
            let variant = class * width + usize::from(inner_conj[inner * syms + position]);
            if distance[variant] == u8::MAX {
                distance[variant] = value;
                marked += 1;
            }
        }
        marked
    };
    let mut distance = vec![u8::MAX; size];
    let mut visited = mark(&mut distance, 0, 0, 0);
    let mut depth = 0u8;
    loop {
        let backward = visited > size / 2;
        let mut found = 0;
        for (class, row) in transitions.iter().enumerate() {
            for inner in 0..width {
                let index = class * width + inner;
                if backward {
                    if distance[index] == u8::MAX && (0..M).any(|mv| distance[neighbor(row, inner, mv)] == depth) {
                        found += mark(&mut distance, class, inner, depth + 1);
                    }
                } else if distance[index] == depth {
                    for mv in 0..M {
                        let target = neighbor(row, inner, mv);
                        if distance[target] == u8::MAX {
                            found += mark(&mut distance, target / width, target % width, depth + 1);
                        }
                    }
                }
            }
        }
        if found == 0 {
            return distance;
        }
        visited += found;
        depth += 1;
    }
}
