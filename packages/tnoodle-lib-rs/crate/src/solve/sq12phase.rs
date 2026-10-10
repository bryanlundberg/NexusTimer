use std::sync::OnceLock;

use crate::random::Rng;

const N_SHAPE: usize = 3678;
const HALF_LAYERS: [u32; 13] = [
    0x00, 0x03, 0x06, 0x0c, 0x0f, 0x18, 0x1b, 0x1e, 0x30, 0x33, 0x36, 0x3c, 0x3f,
];
const OPTIMAL_NODE_BUDGET: u64 = 3_000_000;
const FACTORIAL: [u32; 8] = [1, 1, 2, 6, 24, 120, 720, 5040];

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct FullCube {
    pub ul: u32,
    pub ur: u32,
    pub dl: u32,
    pub dr: u32,
    pub ml: u32,
}

impl FullCube {
    pub const SOLVED: FullCube = FullCube {
        ul: 0x011233,
        ur: 0x455677,
        dl: 0x998bba,
        dr: 0xddcffe,
        ml: 0,
    };

    pub fn is_solved(&self) -> bool {
        *self == FullCube::SOLVED
    }

    pub fn do_move(&mut self, mv: i32) {
        let mut m = mv << 2;
        if m > 24 {
            m = 48 - m;
            let (s, t) = (m as u32, (24 - m) as u32);
            let temp = self.ul;
            self.ul = (self.ul >> s | self.ur << t) & 0xffffff;
            self.ur = (self.ur >> s | temp << t) & 0xffffff;
        } else if m > 0 {
            let (s, t) = (m as u32, (24 - m) as u32);
            let temp = self.ul;
            self.ul = (self.ul << s | self.ur >> t) & 0xffffff;
            self.ur = (self.ur << s | temp >> t) & 0xffffff;
        } else if m == 0 {
            std::mem::swap(&mut self.ur, &mut self.dl);
            self.ml = 1 - self.ml;
        } else if m >= -24 {
            let (s, t) = ((-m) as u32, (24 + m) as u32);
            let temp = self.dl;
            self.dl = (self.dl << s | self.dr >> t) & 0xffffff;
            self.dr = (self.dr << s | temp >> t) & 0xffffff;
        } else {
            let m = 48 + m;
            let (s, t) = (m as u32, (24 - m) as u32);
            let temp = self.dl;
            self.dl = (self.dl >> s | self.dr << t) & 0xffffff;
            self.dr = (self.dr >> s | temp << t) & 0xffffff;
        }
    }

    fn piece_at(&self, index: usize) -> u32 {
        let value = match index {
            0..6 => self.ul >> ((5 - index) << 2),
            6..12 => self.ur >> ((11 - index) << 2),
            12..18 => self.dl >> ((17 - index) << 2),
            _ => self.dr >> ((23 - index) << 2),
        };
        value & 0xf
    }

    fn set_piece(&mut self, index: usize, value: u32) {
        let (word, shift) = match index {
            0..6 => (&mut self.ul, (5 - index) << 2),
            6..12 => (&mut self.ur, (11 - index) << 2),
            12..18 => (&mut self.dl, (17 - index) << 2),
            _ => (&mut self.dr, (23 - index) << 2),
        };
        *word = (*word & !(0xf << shift)) | value << shift;
    }

    fn parity(&self) -> u32 {
        let mut pieces = Vec::with_capacity(16);
        pieces.push(self.piece_at(0));
        for i in 1..24 {
            let piece = self.piece_at(i);
            if piece != *pieces.last().unwrap() {
                pieces.push(piece);
            }
        }
        let mut parity = 0;
        for a in 0..pieces.len() {
            for b in a + 1..pieces.len() {
                if pieces[a] > pieces[b] {
                    parity ^= 1;
                }
            }
        }
        parity
    }

    fn shape_index(&self) -> usize {
        let compress = |word: u32| {
            let mut x = word & 0x111111;
            x |= x >> 3;
            x |= x >> 6;
            (x & 0xf) | ((x >> 12) & 0x30)
        };
        shape2_index(
            self.parity() << 24
                | compress(self.ul) << 18
                | compress(self.ur) << 12
                | compress(self.dl) << 6
                | compress(self.dr),
        )
    }

    fn square(&self) -> SquareState {
        let mut perm = [0u8; 8];
        for (a, slot) in perm.iter_mut().enumerate() {
            *slot = (self.piece_at(a * 3 + 1) >> 1) as u8;
        }
        let corner_perm = get_8_perm(&perm);
        let top_edge_first = self.piece_at(0) == self.piece_at(1);
        let mut a = if top_edge_first { 2 } else { 0 };
        for slot in perm.iter_mut().take(4) {
            *slot = (self.piece_at(a) >> 1) as u8;
            a += 3;
        }
        let bottom_edge_first = self.piece_at(12) == self.piece_at(13);
        a = if bottom_edge_first { 14 } else { 12 };
        for slot in perm.iter_mut().skip(4) {
            *slot = (self.piece_at(a) >> 1) as u8;
            a += 3;
        }
        SquareState {
            edge_perm: get_8_perm(&perm),
            corner_perm,
            top_edge_first,
            bottom_edge_first,
            ml: self.ml as usize,
        }
    }

    pub fn random(rng: &mut Rng) -> FullCube {
        let shape = shape_tables().shape_index[rng.below_usize(N_SHAPE)];
        let mut cube = FullCube::SOLVED;
        let mut corner: u32 = 0x01234567 << 1 | 0x11111111;
        let mut edge: u32 = 0x01234567 << 1;
        let (mut corners_left, mut edges_left) = (8, 8);
        let mut i = 0;
        while i < 24 {
            if (shape >> i) & 1 == 0 {
                let shift = rng.below(edges_left) << 2;
                cube.set_piece(23 - i, (edge >> shift) & 0xf);
                let mask = (1u32 << shift) - 1;
                edge = (edge & mask) + ((edge >> 4) & !mask);
                edges_left -= 1;
            } else {
                let shift = rng.below(corners_left) << 2;
                cube.set_piece(23 - i, (corner >> shift) & 0xf);
                cube.set_piece(22 - i, (corner >> shift) & 0xf);
                let mask = (1u32 << shift) - 1;
                corner = (corner & mask) + ((corner >> 4) & !mask);
                corners_left -= 1;
                i += 1;
            }
            i += 1;
        }
        cube.ml = rng.below(2);
        cube
    }
}

struct SquareState {
    edge_perm: usize,
    corner_perm: usize,
    top_edge_first: bool,
    bottom_edge_first: bool,
    ml: usize,
}

fn set_8_perm(perm: &mut [u8; 8], mut index: u32) {
    let mut val: u32 = 0x76543210;
    for i in 0..7 {
        let p = FACTORIAL[7 - i];
        let mut v = index / p;
        index -= v * p;
        v <<= 2;
        perm[i] = ((val >> v) & 0o7) as u8;
        let mask = (1u32 << v) - 1;
        val = (val & mask) + ((val >> 4) & !mask);
    }
    perm[7] = val as u8;
}

fn get_8_perm(perm: &[u8; 8]) -> usize {
    let mut index: u32 = 0;
    let mut val: u32 = 0x76543210;
    for i in 0..7 {
        let v = u32::from(perm[i]) << 2;
        index = (8 - i as u32) * index + ((val >> v) & 0o7);
        val = val.wrapping_sub(0x11111110u32 << v);
    }
    index as usize
}

struct ShapeTables {
    shape_index: Vec<u32>,
    top_move: Vec<u32>,
    bottom_move: Vec<u32>,
    twist_move: Vec<u32>,
    prun: Vec<i8>,
    prun_opt: Vec<i8>,
}

fn shape2_index(shape: u32) -> usize {
    let index = shape_tables()
        .shape_index
        .binary_search(&(shape & 0xffffff))
        .expect("valid square-1 shape");
    index << 1 | (shape >> 24) as usize
}

struct Shape {
    top: u32,
    bottom: u32,
    parity: u32,
}

impl Shape {
    fn from_index(shape_index: &[u32], index: usize) -> Shape {
        let shape = shape_index[index >> 1];
        Shape {
            top: shape >> 12,
            bottom: shape & 0xfff,
            parity: (index & 1) as u32,
        }
    }

    fn index(&self, shape_index: &[u32]) -> usize {
        let position = shape_index
            .binary_search(&(self.top << 12 | self.bottom))
            .expect("valid square-1 shape");
        position << 1 | self.parity as usize
    }

    fn turn_layer(layer: &mut u32, parity: &mut u32) -> u32 {
        let mut amount = 0;
        let mut move_parity = 0;
        loop {
            if *layer & 0x800 == 0 {
                amount += 1;
                *layer <<= 1;
            } else {
                amount += 2;
                *layer = (*layer << 2) ^ 0x3003;
            }
            move_parity = 1 - move_parity;
            if (*layer & 0x3f).count_ones() & 1 == 0 {
                break;
            }
        }
        if layer.count_ones() & 2 == 0 {
            *parity ^= move_parity;
        }
        amount
    }

    fn twist(&mut self) {
        let temp = self.top & 0x3f;
        let p1 = temp.count_ones();
        let p3 = (self.bottom & 0xfc0).count_ones();
        self.parity ^= 1 & ((p1 & p3) >> 1);
        self.top = (self.top & 0xfc0) | ((self.bottom >> 6) & 0x3f);
        self.bottom = (self.bottom & 0x3f) | temp << 6;
    }
}

fn shape_pruning(table: &ShapeTables, mut prun: Vec<i8>, mut done: usize, wca_metric: bool) -> Vec<i8> {
    let mut done_before = 0;
    let mut depth: i8 = -1;
    while done != done_before {
        done_before = done;
        depth += 1;
        for i in 0..N_SHAPE * 2 {
            if prun[i] != depth {
                continue;
            }
            let twisted = table.twist_move[i] as usize;
            if prun[twisted] == -1 {
                done += 1;
                prun[twisted] = depth + 1;
            }
            let walk = |moves: &[u32], start: usize, visit: &mut dyn FnMut(usize)| {
                let mut total = 0;
                let mut index = start;
                while total != 12 {
                    let entry = moves[index];
                    total += entry & 0xf;
                    index = (entry >> 4) as usize;
                    visit(index);
                }
            };
            let mut found = Vec::new();
            if wca_metric {
                walk(&table.top_move, i, &mut |top| {
                    walk(&table.bottom_move, top, &mut |both| found.push(both));
                });
            } else {
                walk(&table.top_move, i, &mut |index| found.push(index));
                walk(&table.bottom_move, i, &mut |index| found.push(index));
            }
            for index in found {
                if prun[index] == -1 {
                    done += 1;
                    prun[index] = depth + 1;
                }
            }
        }
    }
    prun
}

fn shape_tables() -> &'static ShapeTables {
    static TABLES: OnceLock<ShapeTables> = OnceLock::new();
    TABLES.get_or_init(|| {
        let mut shape_index = Vec::with_capacity(N_SHAPE);
        for i in 0..13 * 13 * 13 * 13 {
            let dr = HALF_LAYERS[i % 13];
            let dl = HALF_LAYERS[i / 13 % 13];
            let ur = HALF_LAYERS[i / 13 / 13 % 13];
            let ul = HALF_LAYERS[i / 13 / 13 / 13];
            let value = ul << 18 | ur << 12 | dl << 6 | dr;
            if value.count_ones() == 16 {
                shape_index.push(value);
            }
        }
        assert_eq!(shape_index.len(), N_SHAPE);

        let mut top_move = vec![0u32; N_SHAPE * 2];
        let mut bottom_move = vec![0u32; N_SHAPE * 2];
        let mut twist_move = vec![0u32; N_SHAPE * 2];
        for i in 0..N_SHAPE * 2 {
            let mut s = Shape::from_index(&shape_index, i);
            let amount = Shape::turn_layer(&mut s.top, &mut s.parity);
            top_move[i] = amount | (s.index(&shape_index) as u32) << 4;
            let mut s = Shape::from_index(&shape_index, i);
            let amount = Shape::turn_layer(&mut s.bottom, &mut s.parity);
            bottom_move[i] = amount | (s.index(&shape_index) as u32) << 4;
            let mut s = Shape::from_index(&shape_index, i);
            s.twist();
            twist_move[i] = s.index(&shape_index) as u32;
        }

        let mut tables = ShapeTables {
            shape_index,
            top_move,
            bottom_move,
            twist_move,
            prun: Vec::new(),
            prun_opt: Vec::new(),
        };
        let index_of = |shape: u32| {
            let position = tables.shape_index.binary_search(&(shape & 0xffffff)).unwrap();
            position << 1 | (shape >> 24) as usize
        };
        let mut prun = vec![-1i8; N_SHAPE * 2];
        for goal in [0x0db66db, 0x1db6db6, 0x16db6db, 0x06dbdb6] {
            prun[index_of(goal)] = 0;
        }
        let solved_shape = {
            let compress = |word: u32| {
                let mut x = word & 0x111111;
                x |= x >> 3;
                x |= x >> 6;
                (x & 0xf) | ((x >> 12) & 0x30)
            };
            let c = FullCube::SOLVED;
            index_of(
                c.parity() << 24 | compress(c.ul) << 18 | compress(c.ur) << 12 | compress(c.dl) << 6 | compress(c.dr),
            )
        };
        let mut prun_opt = vec![-1i8; N_SHAPE * 2];
        prun_opt[solved_shape] = 0;
        let prun = shape_pruning(&tables, prun, 4, false);
        let prun_opt = shape_pruning(&tables, prun_opt, 1, true);
        tables.prun = prun;
        tables.prun_opt = prun_opt;
        tables
    })
}

struct SquareTables {
    prun: Vec<i8>,
    twist_move: Vec<u16>,
    top_move: Vec<u16>,
    bottom_move: Vec<u16>,
}

fn square_tables() -> &'static SquareTables {
    static TABLES: OnceLock<SquareTables> = OnceLock::new();
    TABLES.get_or_init(|| {
        let n = 40320;
        let mut twist_move = vec![0u16; n];
        let mut top_move = vec![0u16; n];
        let mut bottom_move = vec![0u16; n];
        let mut pos = [0u8; 8];
        for i in 0..n {
            set_8_perm(&mut pos, i as u32);
            pos.swap(2, 4);
            pos.swap(3, 5);
            twist_move[i] = get_8_perm(&pos) as u16;
            set_8_perm(&mut pos, i as u32);
            pos[..4].rotate_left(1);
            top_move[i] = get_8_perm(&pos) as u16;
            set_8_perm(&mut pos, i as u32);
            pos[4..].rotate_left(1);
            bottom_move[i] = get_8_perm(&pos) as u16;
        }
        let mut prun = vec![-1i8; n * 2];
        prun[0] = 0;
        let mut depth: i8 = 0;
        let mut done = 1;
        while done < n * 2 {
            let inverse = depth >= 11;
            let find = if inverse { -1 } else { depth };
            let check = if inverse { depth } else { -1 };
            depth += 1;
            'states: for i in 0..n * 2 {
                if prun[i] != find {
                    continue;
                }
                let mut perm = i >> 1;
                let ml = i & 1;
                let mut visit = |prun: &mut Vec<i8>, idx: usize| {
                    if prun[idx] == check {
                        done += 1;
                        prun[if inverse { i } else { idx }] = depth;
                        return inverse;
                    }
                    false
                };
                let idx = (twist_move[perm] as usize) << 1 | (1 - ml);
                if visit(&mut prun, idx) {
                    continue 'states;
                }
                for _ in 0..4 {
                    perm = top_move[perm] as usize;
                    if visit(&mut prun, perm << 1 | ml) {
                        continue 'states;
                    }
                }
                for _ in 0..4 {
                    perm = bottom_move[perm] as usize;
                    if visit(&mut prun, perm << 1 | ml) {
                        continue 'states;
                    }
                }
            }
        }
        SquareTables {
            prun,
            twist_move,
            top_move,
            bottom_move,
        }
    })
}

pub struct Search {
    cube: FullCube,
    moves: [i32; 100],
    length1: usize,
    move_length1: usize,
    max_length2: usize,
    nodes: u64,
}

impl Search {
    pub fn new(cube: FullCube) -> Search {
        Search {
            cube,
            moves: [0; 100],
            length1: 0,
            move_length1: 0,
            max_length2: 0,
            nodes: 0,
        }
    }

    pub fn solution(&mut self) -> Vec<i32> {
        let shapes = shape_tables();
        let shape = self.cube.shape_index();
        self.length1 = shapes.prun[shape] as usize;
        while self.length1 < 100 {
            self.max_length2 = 17;
            if let Some(length) = self.ida_phase1(shape, shapes.prun[shape], self.length1, 0, -1) {
                return self.moves[..length].to_vec();
            }
            self.length1 += 1;
        }
        unreachable!("square-1 always has a solution")
    }

    fn ida_phase1(
        &mut self,
        shape: usize,
        prun_value: i8,
        max_length: usize,
        depth: usize,
        last: i32,
    ) -> Option<usize> {
        let shapes = shape_tables();
        if prun_value == 0 && max_length < 4 {
            self.move_length1 = depth;
            return if max_length == 0 { self.init_phase2() } else { None };
        }
        if last != 0 {
            let next = shapes.twist_move[shape] as usize;
            let prun = shapes.prun[next];
            if (prun as isize) < max_length as isize {
                self.moves[depth] = 0;
                if let Some(length) = self.ida_phase1(next, prun, max_length - 1, depth + 1, 0) {
                    return Some(length);
                }
            }
        }
        for (layer, table, limit) in [(1, &shapes.top_move, 12), (2, &shapes.bottom_move, 6)] {
            if last > layer - 1 {
                continue;
            }
            let mut m = 0;
            let mut next = shape;
            loop {
                let entry = table[next];
                m += entry & 0xf;
                next = (entry >> 4) as usize;
                if m >= limit {
                    break;
                }
                let prun = shapes.prun[next];
                if prun as isize > max_length as isize {
                    break;
                } else if (prun as isize) < max_length as isize {
                    self.moves[depth] = if layer == 1 { m as i32 } else { -(m as i32) };
                    if let Some(length) = self.ida_phase1(next, prun, max_length - 1, depth + 1, layer) {
                        return Some(length);
                    }
                }
            }
        }
        None
    }

    fn init_phase2(&mut self) -> Option<usize> {
        let mut cube = self.cube;
        for &mv in &self.moves[..self.move_length1] {
            cube.do_move(mv);
        }
        let sq = cube.square();
        let squares = square_tables();
        let prun = squares.prun[sq.edge_perm << 1 | sq.ml].max(squares.prun[sq.corner_perm << 1 | sq.ml]);
        for length in prun as usize..self.max_length2 {
            if self.ida_phase2(
                sq.edge_perm,
                sq.corner_perm,
                sq.top_edge_first,
                sq.bottom_edge_first,
                sq.ml,
                length,
                self.move_length1,
                0,
            ) {
                return Some(length + self.move_length1);
            }
        }
        None
    }

    #[allow(clippy::too_many_arguments)]
    fn ida_phase2(
        &mut self,
        edge: usize,
        corner: usize,
        top_edge_first: bool,
        bottom_edge_first: bool,
        ml: usize,
        max_length: usize,
        depth: usize,
        last: i32,
    ) -> bool {
        let sq = square_tables();
        if max_length == 0 && !top_edge_first && bottom_edge_first {
            return true;
        }
        let max = max_length as i8;
        if last != 0 && top_edge_first == bottom_edge_first {
            let edge_next = sq.twist_move[edge] as usize;
            let corner_next = sq.twist_move[corner] as usize;
            if sq.prun[edge_next << 1 | (1 - ml)] < max && sq.prun[corner_next << 1 | (1 - ml)] < max {
                self.moves[depth] = 0;
                if self.ida_phase2(
                    edge_next,
                    corner_next,
                    top_edge_first,
                    bottom_edge_first,
                    1 - ml,
                    max_length - 1,
                    depth + 1,
                    0,
                ) {
                    return true;
                }
            }
        }
        for (layer, table, sign) in [(1, &sq.top_move, 1), (2, &sq.bottom_move, -1)] {
            if last > layer - 1 {
                continue;
            }
            let edge_first = if layer == 1 { top_edge_first } else { bottom_edge_first };
            let mut edge_first_next = !edge_first;
            let mut edge_next = if edge_first_next { table[edge] as usize } else { edge };
            let mut corner_next = if edge_first_next {
                corner
            } else {
                table[corner] as usize
            };
            let mut m = if edge_first_next { 1 } else { 2 };
            let mut prun1 = sq.prun[edge_next << 1 | ml];
            let mut prun2 = sq.prun[corner_next << 1 | ml];
            let limit = if layer == 1 || max_length <= 6 { 12 } else { 6 };
            while m < limit && prun1 <= max {
                if prun1 < max && prun2 < max {
                    self.moves[depth] = sign * m;
                    let (top, bottom) = if layer == 1 {
                        (edge_first_next, bottom_edge_first)
                    } else {
                        (top_edge_first, edge_first_next)
                    };
                    if self.ida_phase2(
                        edge_next,
                        corner_next,
                        top,
                        bottom,
                        ml,
                        max_length - 1,
                        depth + 1,
                        layer,
                    ) {
                        return true;
                    }
                }
                edge_first_next = !edge_first_next;
                if edge_first_next {
                    edge_next = table[edge_next] as usize;
                    prun1 = sq.prun[edge_next << 1 | ml];
                    m += 1;
                } else {
                    corner_next = table[corner_next] as usize;
                    prun2 = sq.prun[corner_next << 1 | ml];
                    m += 2;
                }
            }
        }
        false
    }

    pub fn within_or_unknown(cube: &FullCube, max_length: usize) -> bool {
        let shapes = shape_tables();
        let shape = cube.shape_index();
        let mut search = Search::new(*cube);
        let mut length = shapes.prun_opt[shape] as usize * 2;
        while length <= max_length * 2 {
            if search.phase1_opt(shape, length, 0, -1, 0) || search.nodes > OPTIMAL_NODE_BUDGET {
                return true;
            }
            length += 2;
        }
        false
    }

    fn phase1_opt(&mut self, shape: usize, max_length: usize, depth: usize, last: i32, last_turns: u32) -> bool {
        self.nodes += 1;
        if self.nodes > OPTIMAL_NODE_BUDGET {
            return false;
        }
        let shapes = shape_tables();
        let i = count_0xf((last_turns ^ !0) & 0xff00ff) as i32 - count_0xf((last_turns ^ !0x666666) & 0xff00ff) as i32;
        if i < 0 || i == 0 && (last_turns >> 20 & 0xf) >= 6 {
            return false;
        }
        if max_length / 2 == 0 {
            self.move_length1 = depth;
            let mut cube = self.cube;
            for &mv in &self.moves[..depth] {
                cube.do_move(mv);
            }
            if cube.is_solved() {
                return true;
            }
            if max_length == 0 {
                return false;
            }
        }
        if last != 0 {
            let next = shapes.twist_move[shape] as usize;
            let prun = shapes.prun_opt[next] as usize;
            if prun < max_length / 2 {
                self.moves[depth] = 0;
                if self.phase1_opt(next, (max_length / 2 - 1) * 2, depth + 1, 0, last_turns << 8) {
                    return true;
                }
            }
        }
        for (layer, table) in [(1, &shapes.top_move), (2, &shapes.bottom_move)] {
            if last > layer - 1 {
                continue;
            }
            let mut m = 0;
            let mut next = shape;
            loop {
                let entry = table[next];
                m += entry & 0xf;
                next = (entry >> 4) as usize;
                if m >= 12 {
                    break;
                }
                let prun = shapes.prun_opt[next] as usize * 2;
                if prun > max_length + 1 {
                    break;
                } else if prun < max_length + 1 {
                    self.moves[depth] = if layer == 1 { m as i32 } else { -(m as i32) };
                    let turns = if layer == 1 {
                        last_turns | m << 4
                    } else {
                        last_turns | m
                    };
                    if self.phase1_opt(next, max_length - 1, depth + 1, layer, turns) {
                        return true;
                    }
                }
            }
        }
        false
    }
}

fn count_0xf(mut value: u32) -> u32 {
    value &= value >> 1;
    value &= value >> 2;
    (value & 0x11111111).count_ones()
}

pub fn scramble_string(solution: &[i32]) -> String {
    let inverted: Vec<i32> = solution
        .iter()
        .rev()
        .map(|&mv| match mv.signum() {
            1 => 12 - mv,
            -1 => -12 - mv,
            _ => 0,
        })
        .collect();
    let mut text = String::new();
    let (mut top, mut bottom) = (0, 0);
    for value in inverted {
        if value > 0 {
            top = if value > 6 { value - 12 } else { value };
        } else if value < 0 {
            bottom = if -value > 6 { -value - 12 } else { -value };
        } else {
            if top == 0 && bottom == 0 {
                text.push_str(" / ");
            } else {
                text.push_str(&format!("({top},{bottom}) / "));
            }
            top = 0;
            bottom = 0;
        }
    }
    if top != 0 || bottom != 0 {
        text.push_str(&format!("({top},{bottom})"));
    }
    text.trim().to_string()
}
