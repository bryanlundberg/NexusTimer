use std::collections::{HashMap, VecDeque};
use std::sync::{Arc, Mutex, OnceLock};

use cube_core::cube::{CubieCube, N_MOVES, allowed_after};
use cube_core::search::{Budget, Outcome};

const CODES: usize = 24;
const MAX_GROUP: usize = 4;
const N_TWIST: usize = 2187;
const N_FLIP: usize = 2048;
const MAX_CACHED_TABLES: usize = 32;

#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub enum Kind {
    Corner,
    Edge,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub struct Placement {
    pub kind: Kind,
    pub label: u8,
    pub position: u8,
    pub orientation: u8,
}

impl Placement {
    pub fn solved(kind: Kind, label: u8) -> Self {
        Self {
            kind,
            label,
            position: label,
            orientation: 0,
        }
    }

    pub fn in_cube(cube: &CubieCube, kind: Kind, label: u8) -> Self {
        let (permutation, orientation): (&[u8], &[u8]) = match kind {
            Kind::Corner => (&cube.cp, &cube.co),
            Kind::Edge => (&cube.ep, &cube.eo),
        };
        let position = permutation
            .iter()
            .position(|&piece| piece == label)
            .expect("every piece has a position");
        Self {
            kind,
            label,
            position: position as u8,
            orientation: orientation[position],
        }
    }

    fn code(&self) -> u8 {
        encode(self.kind, self.position, self.orientation)
    }
}

pub struct Goal {
    pub exact: Vec<Placement>,
    pub groups: Vec<Vec<Placement>>,
    pub corner_orientation: [Option<u8>; 8],
    pub edge_orientation: [Option<u8>; 12],
}

impl Goal {
    pub fn new(exact: Vec<Placement>, groups: Vec<Vec<Placement>>) -> Self {
        let mut goal = Self {
            exact,
            groups,
            corner_orientation: [None; 8],
            edge_orientation: [None; 12],
        };
        for placement in &goal.exact {
            let position = usize::from(placement.position);
            match placement.kind {
                Kind::Corner => goal.corner_orientation[position] = Some(placement.orientation),
                Kind::Edge => goal.edge_orientation[position] = Some(placement.orientation),
            }
        }
        goal
    }

    fn free_labels(&self, kind: Kind, count: u8) -> Vec<u8> {
        (0..count)
            .filter(|&label| !self.exact.iter().any(|p| p.kind == kind && p.label == label))
            .collect()
    }
}

fn encode(kind: Kind, position: u8, orientation: u8) -> u8 {
    match kind {
        Kind::Corner => position * 3 + orientation,
        Kind::Edge => position * 2 + orientation,
    }
}

fn decode(kind: Kind, code: u8) -> (usize, u8) {
    match kind {
        Kind::Corner => (usize::from(code / 3), code % 3),
        Kind::Edge => (usize::from(code / 2), code % 2),
    }
}

struct MoveTables {
    corner: [[u8; CODES]; N_MOVES],
    edge: [[u8; CODES]; N_MOVES],
    twist: Vec<[u16; N_MOVES]>,
    flip: Vec<[u16; N_MOVES]>,
}

fn twist(cube: &CubieCube) -> usize {
    cube.co[..7].iter().fold(0, |acc, &o| acc * 3 + usize::from(o))
}

fn flip(cube: &CubieCube) -> usize {
    cube.eo[..11].iter().fold(0, |acc, &o| acc * 2 + usize::from(o))
}

fn with_twist(mut coordinate: usize) -> CubieCube {
    let mut cube = CubieCube::SOLVED;
    let mut sum = 0;
    for o in cube.co[..7].iter_mut().rev() {
        *o = (coordinate % 3) as u8;
        sum += *o;
        coordinate /= 3;
    }
    cube.co[7] = (3 - sum % 3) % 3;
    cube
}

fn with_flip(mut coordinate: usize) -> CubieCube {
    let mut cube = CubieCube::SOLVED;
    let mut sum = 0;
    for o in cube.eo[..11].iter_mut().rev() {
        *o = (coordinate % 2) as u8;
        sum += *o;
        coordinate /= 2;
    }
    cube.eo[11] = sum % 2;
    cube
}

fn move_tables() -> &'static MoveTables {
    static TABLES: OnceLock<MoveTables> = OnceLock::new();
    TABLES.get_or_init(|| {
        let turns: [CubieCube; N_MOVES] = std::array::from_fn(|mv| CubieCube::SOLVED.apply_move(mv));
        let mut corner = [[0u8; CODES]; N_MOVES];
        let mut edge = [[0u8; CODES]; N_MOVES];
        for (mv, turn) in turns.iter().enumerate() {
            for to in 0..8 {
                let from = turn.cp[to];
                for o in 0..3 {
                    corner[mv][usize::from(from * 3 + o)] = to as u8 * 3 + (o + turn.co[to]) % 3;
                }
            }
            for to in 0..12 {
                let from = turn.ep[to];
                for o in 0..2 {
                    edge[mv][usize::from(from * 2 + o)] = to as u8 * 2 + (o + turn.eo[to]) % 2;
                }
            }
        }
        let twist = (0..N_TWIST)
            .map(|t| std::array::from_fn(|mv| twist(&with_twist(t).multiply(&turns[mv])) as u16))
            .collect();
        let flip = (0..N_FLIP)
            .map(|f| std::array::from_fn(|mv| flip(&with_flip(f).multiply(&turns[mv])) as u16))
            .collect();
        MoveTables {
            corner,
            edge,
            twist,
            flip,
        }
    })
}

#[derive(Clone, Copy)]
struct Node {
    corners: [u8; 8],
    edges: [u8; 12],
    twist: u16,
    flip: u16,
}

impl Node {
    fn of(cube: &CubieCube) -> Self {
        let mut corners = [0; 8];
        let mut edges = [0; 12];
        for position in 0..8 {
            corners[usize::from(cube.cp[position])] = encode(Kind::Corner, position as u8, cube.co[position]);
        }
        for position in 0..12 {
            edges[usize::from(cube.ep[position])] = encode(Kind::Edge, position as u8, cube.eo[position]);
        }
        Self {
            corners,
            edges,
            twist: twist(cube) as u16,
            flip: flip(cube) as u16,
        }
    }

    fn turn(&self, mv: usize, tables: &MoveTables) -> Self {
        let corner = &tables.corner[mv];
        let edge = &tables.edge[mv];
        Self {
            corners: self.corners.map(|code| corner[usize::from(code)]),
            edges: self.edges.map(|code| edge[usize::from(code)]),
            twist: tables.twist[usize::from(self.twist)][mv],
            flip: tables.flip[usize::from(self.flip)][mv],
        }
    }

    fn code(&self, kind: Kind, label: u8) -> u8 {
        match kind {
            Kind::Corner => self.corners[usize::from(label)],
            Kind::Edge => self.edges[usize::from(label)],
        }
    }
}

struct PatternTable {
    pieces: Vec<(Kind, u8)>,
    distance: Vec<u8>,
}

impl PatternTable {
    fn build(group: &[Placement]) -> Self {
        assert!(group.len() <= MAX_GROUP, "pattern groups hold up to {MAX_GROUP} pieces");
        let tables = move_tables();
        let mut contributions = [[[0u32; N_MOVES]; CODES]; MAX_GROUP];
        for (i, placement) in group.iter().enumerate() {
            let moves = match placement.kind {
                Kind::Corner => &tables.corner,
                Kind::Edge => &tables.edge,
            };
            let weight = CODES.pow(i as u32) as u32;
            for (code, row) in contributions[i].iter_mut().enumerate() {
                for (mv, contribution) in row.iter_mut().enumerate() {
                    *contribution = u32::from(moves[mv][code]) * weight;
                }
            }
        }
        let mut distance = vec![u8::MAX; CODES.pow(group.len() as u32)];
        let start = group
            .iter()
            .rev()
            .fold(0, |index, p| index * CODES + usize::from(p.code()));
        distance[start] = 0;
        let mut frontier = vec![start as u32];
        let mut depth = 0u8;
        while !frontier.is_empty() {
            let mut next = Vec::with_capacity(frontier.len() * 4);
            for &index in &frontier {
                let index = index as usize;
                let rows: [&[u32; N_MOVES]; MAX_GROUP] =
                    std::array::from_fn(|i| &contributions[i][index / CODES.pow(i as u32) % CODES]);
                for mv in 0..N_MOVES {
                    let target = (rows[0][mv] + rows[1][mv] + rows[2][mv] + rows[3][mv]) as usize;
                    if distance[target] == u8::MAX {
                        distance[target] = depth + 1;
                        next.push(target as u32);
                    }
                }
            }
            frontier = next;
            depth += 1;
        }
        Self {
            pieces: group.iter().map(|p| (p.kind, p.label)).collect(),
            distance,
        }
    }

    fn distance(&self, node: &Node) -> u8 {
        let index = self.pieces.iter().rev().fold(0, |index, &(kind, label)| {
            index * CODES + usize::from(node.code(kind, label))
        });
        self.distance[index]
    }
}

fn orientation_table(size: usize, target: usize, moves: &[[u16; N_MOVES]]) -> Vec<u8> {
    let mut distance = vec![u8::MAX; size];
    distance[target] = 0;
    let mut frontier = vec![target];
    let mut depth = 0u8;
    while !frontier.is_empty() {
        let mut next = Vec::new();
        for &coordinate in &frontier {
            for &moved in &moves[coordinate] {
                let moved = usize::from(moved);
                if distance[moved] == u8::MAX {
                    distance[moved] = depth + 1;
                    next.push(moved);
                }
            }
        }
        frontier = next;
        depth += 1;
    }
    distance
}

#[derive(Clone, PartialEq, Eq, Hash)]
enum TableKey {
    Pattern(Vec<Placement>),
    Twist(usize),
    Flip(usize),
}

enum Table {
    Pattern(PatternTable),
    Orientation(Vec<u8>),
}

#[derive(Default)]
struct TableCache {
    tables: HashMap<TableKey, Arc<Table>>,
    order: VecDeque<TableKey>,
}

fn cached(key: TableKey) -> Arc<Table> {
    static CACHE: OnceLock<Mutex<TableCache>> = OnceLock::new();
    let cache = CACHE.get_or_init(Mutex::default);
    if let Some(table) = cache.lock().expect("table cache").tables.get(&key) {
        return Arc::clone(table);
    }
    let tables = move_tables();
    let table = Arc::new(match &key {
        TableKey::Pattern(group) => Table::Pattern(PatternTable::build(group)),
        TableKey::Twist(target) => Table::Orientation(orientation_table(N_TWIST, *target, &tables.twist)),
        TableKey::Flip(target) => Table::Orientation(orientation_table(N_FLIP, *target, &tables.flip)),
    });
    let mut cache = cache.lock().expect("table cache");
    if cache.order.len() >= MAX_CACHED_TABLES
        && let Some(oldest) = cache.order.pop_front()
    {
        cache.tables.remove(&oldest);
    }
    cache.order.push_back(key.clone());
    cache.tables.insert(key, Arc::clone(&table));
    table
}

fn full_orientation<const N: usize>(orientation: &[Option<u8>; N]) -> Option<CubieCube> {
    let values: Vec<u8> = orientation.iter().copied().collect::<Option<_>>()?;
    let mut cube = CubieCube::SOLVED;
    if N == 8 {
        cube.co.copy_from_slice(&values);
    } else {
        cube.eo.copy_from_slice(&values);
    }
    Some(cube)
}

struct Search<'a, B: Budget> {
    goal: &'a Goal,
    tables: &'static MoveTables,
    patterns: Vec<Arc<Table>>,
    twist: Option<Arc<Table>>,
    flip: Option<Arc<Table>>,
    free_corners: Vec<u8>,
    free_edges: Vec<u8>,
    path: Vec<usize>,
    budget: &'a mut B,
}

impl<B: Budget> Search<'_, B> {
    fn exceeds(&self, node: &Node, limit: usize) -> bool {
        let over = |distance: u8| usize::from(distance) > limit;
        self.patterns.iter().any(|table| match table.as_ref() {
            Table::Pattern(pattern) => over(pattern.distance(node)),
            Table::Orientation(_) => false,
        }) || matches!(self.twist.as_deref(), Some(Table::Orientation(d)) if over(d[usize::from(node.twist)]))
            || matches!(self.flip.as_deref(), Some(Table::Orientation(d)) if over(d[usize::from(node.flip)]))
    }

    fn bound(&self, node: &Node) -> usize {
        (0..)
            .find(|&limit| !self.exceeds(node, limit))
            .expect("distances are finite")
    }

    fn reached(&self, node: &Node) -> bool {
        self.goal.exact.iter().all(|p| node.code(p.kind, p.label) == p.code())
            && self.free_corners.iter().all(|&label| {
                let (position, orientation) = decode(Kind::Corner, node.corners[usize::from(label)]);
                self.goal.corner_orientation[position].is_none_or(|o| o == orientation)
            })
            && self.free_edges.iter().all(|&label| {
                let (position, orientation) = decode(Kind::Edge, node.edges[usize::from(label)]);
                self.goal.edge_orientation[position].is_none_or(|o| o == orientation)
            })
    }

    fn dfs(&mut self, node: Node, remaining: usize) -> bool {
        if !self.budget.spend() {
            return false;
        }
        if remaining == 0 {
            return self.reached(&node);
        }
        let last = self.path.last().copied();
        for mv in 0..N_MOVES {
            if last.is_some_and(|last| !allowed_after(mv, last)) {
                continue;
            }
            let next = node.turn(mv, self.tables);
            if self.exceeds(&next, remaining - 1) {
                continue;
            }
            self.path.push(mv);
            if self.dfs(next, remaining - 1) {
                return true;
            }
            self.path.pop();
        }
        false
    }
}

pub fn solve(start: &CubieCube, goal: &Goal, max_length: usize, budget: &mut impl Budget) -> Outcome {
    let twist = full_orientation(&goal.corner_orientation).map(|cube| cached(TableKey::Twist(twist(&cube))));
    let flip = full_orientation(&goal.edge_orientation).map(|cube| cached(TableKey::Flip(flip(&cube))));
    let mut search = Search {
        goal,
        tables: move_tables(),
        patterns: goal
            .groups
            .iter()
            .map(|group| cached(TableKey::Pattern(group.clone())))
            .collect(),
        twist,
        flip,
        free_corners: goal.free_labels(Kind::Corner, 8),
        free_edges: goal.free_labels(Kind::Edge, 12),
        path: Vec::new(),
        budget,
    };
    let node = Node::of(start);
    for length in search.bound(&node)..=max_length {
        if search.dfs(node, length) {
            return Outcome::Found(search.path);
        }
        if search.budget.is_spent() {
            return Outcome::OutOfBudget;
        }
    }
    Outcome::NoneWithinLength
}

#[cfg(test)]
mod tests {
    use super::*;
    use cube_core::search::NodeBudget;

    fn cross() -> Vec<Placement> {
        (4..8).map(|label| Placement::solved(Kind::Edge, label)).collect()
    }

    #[test]
    fn pattern_distance_is_zero_only_at_the_target() {
        let table = PatternTable::build(&cross());
        assert_eq!(table.distance(&Node::of(&CubieCube::SOLVED)), 0);
        assert_eq!(table.distance(&Node::of(&CubieCube::SOLVED.apply_move(3))), 1);
        assert_eq!(table.distance(&Node::of(&CubieCube::SOLVED.apply_move(0))), 0);
        let reachable = table.distance.iter().filter(|&&d| d != u8::MAX).count();
        assert_eq!(reachable, 12 * 11 * 10 * 9 * 16);
        assert_eq!(table.distance.iter().filter(|&&d| d != u8::MAX).max(), Some(&8));
    }

    #[test]
    fn orientation_tables_reach_every_coordinate() {
        let tables = move_tables();
        let twists = orientation_table(N_TWIST, 0, &tables.twist);
        let flips = orientation_table(N_FLIP, 0, &tables.flip);
        assert!(twists.iter().all(|&d| d != u8::MAX));
        assert!(flips.iter().all(|&d| d != u8::MAX));
        assert_eq!(twists[twist(&CubieCube::SOLVED.apply_move(3))], 1);
        assert_eq!(flips[flip(&CubieCube::SOLVED.apply_move(3))], 0);
    }

    #[test]
    fn solves_a_masked_goal_and_reports_its_limits() {
        let scrambled = [3, 6, 10, 16, 1]
            .iter()
            .fold(CubieCube::SOLVED, |c, &mv| c.apply_move(mv));
        let goal = Goal::new(cross(), vec![cross()]);
        let Outcome::Found(moves) = solve(&scrambled, &goal, 8, &mut NodeBudget::new(1_000_000)) else {
            panic!("cross found");
        };
        let solved = scrambled.apply_moves(&moves);
        assert!((4..8).all(|i| solved.ep[i] == i as u8 && solved.eo[i] == 0));
        assert_eq!(
            solve(&scrambled, &goal, moves.len() - 1, &mut NodeBudget::new(1_000_000)),
            Outcome::NoneWithinLength
        );
        assert_eq!(
            solve(&scrambled, &goal, 8, &mut NodeBudget::new(3)),
            Outcome::OutOfBudget
        );
    }

    #[test]
    fn orientation_constraints_apply_to_free_pieces() {
        let sune = [3, 0, 5, 0, 3, 1, 5];
        let goal = Goal {
            corner_orientation: [Some(0); 8],
            edge_orientation: [Some(0); 12],
            ..Goal::new(Vec::new(), Vec::new())
        };
        let start = sune.iter().fold(CubieCube::SOLVED, |c, &mv| c.apply_move(mv));
        let Outcome::Found(moves) = solve(&start, &goal, 7, &mut NodeBudget::new(10_000_000)) else {
            panic!("orientation solved");
        };
        let end = start.apply_moves(&moves);
        assert!(end.co.iter().all(|&o| o == 0) && end.eo.iter().all(|&o| o == 0));
    }
}
