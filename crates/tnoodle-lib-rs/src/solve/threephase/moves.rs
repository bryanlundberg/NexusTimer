use std::sync::OnceLock;

pub const UX1: usize = 18;
pub const RX1: usize = 21;
pub const FX1: usize = 24;
pub const DX1: usize = 27;
pub const DX3: usize = 29;
pub const LX3: usize = 32;
pub const BX3: usize = 35;
pub const UX2: usize = 19;
pub const DX2: usize = 28;
pub const EOM: usize = 36;

pub const MOVE2STR: [&str; 36] = [
    "U", "U2", "U'", "R", "R2", "R'", "F", "F2", "F'", "D", "D2", "D'", "L", "L2", "L'", "B", "B2", "B'", "Uw", "Uw2",
    "Uw'", "Rw", "Rw2", "Rw'", "Fw", "Fw2", "Fw'", "Dw", "Dw2", "Dw'", "Lw", "Lw2", "Lw'", "Bw", "Bw2", "Bw'",
];

pub const MOVE2STD: [usize; 29] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 22, 23, 25, 28, 30, 31, 32, 34, EOM,
];
pub const MOVE3STD: [usize; 21] = [
    0, 1, 2, 4, 6, 7, 8, 9, 10, 11, 13, 15, 16, 17, 19, 22, 25, 28, 31, 34, EOM,
];

pub struct MoveTables {
    pub ckmv2: [[bool; 28]; 29],
    pub ckmv3: [[bool; 20]; 21],
    pub skip_axis2: [usize; 28],
    pub skip_axis3: [usize; 20],
}

pub fn move_tables() -> &'static MoveTables {
    static TABLES: OnceLock<MoveTables> = OnceLock::new();
    TABLES.get_or_init(|| {
        let mut ckmv = [[false; 36]; 37];
        for (i, row) in ckmv.iter_mut().enumerate().take(36) {
            for (j, cell) in row.iter_mut().enumerate() {
                *cell = (i / 3 == j / 3) || ((i / 3 % 3 == j / 3 % 3) && (i > j));
            }
        }
        let mut ckmv2 = [[false; 28]; 29];
        for i in 0..29 {
            for j in 0..28 {
                ckmv2[i][j] = ckmv[MOVE2STD[i]][MOVE2STD[j]];
            }
        }
        let mut ckmv3 = [[false; 20]; 21];
        for i in 0..21 {
            for j in 0..20 {
                ckmv3[i][j] = ckmv[MOVE3STD[i]][MOVE3STD[j]];
            }
        }
        let skip =
            |row: &dyn Fn(usize, usize) -> bool, n: usize, i: usize| (i..n).find(|&j| !row(i, j)).map_or(n, |j| j - 1);
        let skip_axis2 = std::array::from_fn(|i| skip(&|a, b| ckmv2[a][b], 28, i));
        let skip_axis3 = std::array::from_fn(|i| skip(&|a, b| ckmv3[a][b], 20, i));
        MoveTables {
            ckmv2,
            ckmv3,
            skip_axis2,
            skip_axis3,
        }
    })
}

pub fn cnk(n: usize, k: usize) -> i32 {
    static TABLE: OnceLock<[[i32; 25]; 25]> = OnceLock::new();
    TABLE.get_or_init(|| {
        let mut c = [[0i32; 25]; 25];
        for i in 0..25 {
            c[i][0] = 1;
            c[i][i] = 1;
        }
        for i in 1..25 {
            for j in 1..=i {
                c[i][j] = c[i - 1][j] + c[i - 1][j - 1];
            }
        }
        c
    })[n][k]
}

pub fn swap4<T: Copy>(arr: &mut [T], a: usize, b: usize, c: usize, d: usize, key: usize) {
    match key {
        0 => {
            let t = arr[d];
            arr[d] = arr[c];
            arr[c] = arr[b];
            arr[b] = arr[a];
            arr[a] = t;
        }
        1 => {
            arr.swap(a, c);
            arr.swap(b, d);
        }
        _ => {
            let t = arr[a];
            arr[a] = arr[b];
            arr[b] = arr[c];
            arr[c] = arr[d];
            arr[d] = t;
        }
    }
}

pub fn parity(arr: &[u8]) -> i32 {
    let mut parity = 0;
    for i in 0..arr.len() {
        for j in i..arr.len() {
            if arr[i] > arr[j] {
                parity ^= 1;
            }
        }
    }
    parity
}
