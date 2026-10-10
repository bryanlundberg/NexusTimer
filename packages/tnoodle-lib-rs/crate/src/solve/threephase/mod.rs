mod center1;
mod center2;
mod center3;
mod cubes;
mod edge3;
mod moves;

use center1::Center1;
use center2::Center2;
use center3::Center3;
use cubes::FullCube;
use edge3::Edge3;
use moves::{BX3, DX3, FX1, MOVE2STD, MOVE3STD, UX1, move_tables};

use super::cube::CubieCube;
use super::two_phase;
use crate::random::Rng;

const PHASE1_SOLUTIONS: usize = 10000;
const PHASE2_ATTEMPTS: usize = 500;
const PHASE2_SOLUTIONS: usize = 100;
const PHASE3_ATTEMPTS: usize = 100;

struct Search {
    p1sols: Vec<FullCube>,
    move1: [usize; 15],
    move2: [usize; 20],
    move3: [usize; 20],
    length1: usize,
    length2: usize,
    add1: bool,
    c: FullCube,
    c1: FullCube,
    c2: FullCube,
    ct2: Center2,
    ct3: Center3,
    e12: Edge3,
    tempe: [Edge3; 20],
    p1_count: usize,
    arr2: Vec<FullCube>,
}

impl Search {
    fn new(c: FullCube) -> Search {
        Search {
            p1sols: Vec::with_capacity(PHASE2_ATTEMPTS),
            move1: [0; 15],
            move2: [0; 20],
            move3: [0; 20],
            length1: 0,
            length2: 0,
            add1: false,
            c1: c.clone(),
            c2: c.clone(),
            c,
            ct2: Center2::default(),
            ct3: Center3::default(),
            e12: Edge3::default(),
            tempe: [Edge3::default(); 20],
            p1_count: 0,
            arr2: Vec::with_capacity(PHASE2_SOLUTIONS),
        }
    }

    fn solve(mut self) -> Vec<&'static str> {
        let t1 = center1::tables();
        let center = *self.c.center();
        let ud = Center1::from_center(&center, 0).sym();
        let fb = Center1::from_center(&center, 1).sym();
        let rl = Center1::from_center(&center, 2).sym();
        let prun = |sym: i32| i32::from(t1.csprun[(sym >> 6) as usize]);
        let (ud_prun, fb_prun, rl_prun) = (prun(ud), prun(fb), prun(rl));
        let mut length1 = ud_prun.min(fb_prun).min(rl_prun);
        while length1 < 100 {
            self.length1 = length1 as usize;
            let start =
                |s: &mut Search, sym: i32| s.search1((sym >> 6) as usize, (sym & 0x3f) as usize, length1, -1, 0);
            if rl_prun <= length1 && start(&mut self, rl)
                || ud_prun <= length1 && start(&mut self, ud)
                || fb_prun <= length1 && start(&mut self, fb)
            {
                break;
            }
            length1 += 1;
        }

        let mut p1 = std::mem::take(&mut self.p1sols);
        p1.sort_by_key(|c| c.value);
        let mut max_length2 = 9;
        'phase2: loop {
            let mut length12 = p1[0].value;
            while length12 < 100 {
                for candidate in p1.iter() {
                    if candidate.value > length12 {
                        break;
                    }
                    if length12 - candidate.length1 as i32 > max_length2 {
                        continue;
                    }
                    self.c1 = candidate.clone();
                    let edge_parity = self.c1.edge().parity();
                    let center = *self.c1.center();
                    self.ct2.set(&center, edge_parity);
                    let (s2ct, s2rl) = (self.ct2.ct_index(), self.ct2.rl_index());
                    self.length1 = candidate.length1;
                    self.length2 = (length12 - candidate.length1 as i32) as usize;
                    if self.search2(s2ct, s2rl, self.length2 as i32, 28, 0) {
                        break 'phase2;
                    }
                }
                length12 += 1;
            }
            max_length2 += 1;
        }

        self.arr2.sort_by_key(|c| c.value);
        let te = edge3::tables();
        let mut max_length3 = 13;
        let (index, length123) = 'phase3: loop {
            let mut length123 = self.arr2[0].value;
            while length123 < 100 {
                for i in 0..self.arr2.len().min(PHASE3_ATTEMPTS) {
                    let candidate = &mut self.arr2[i];
                    if candidate.value > length123 {
                        break;
                    }
                    let remaining = length123 - candidate.length1 as i32 - candidate.length2 as i32;
                    if remaining > max_length3 {
                        continue;
                    }
                    let edge_parity = self.e12.set_cube(candidate.edge());
                    let corner_parity = candidate.corner().parity();
                    let center = *candidate.center();
                    self.ct3.set(&center, edge_parity ^ corner_parity);
                    let ct = self.ct3.index();
                    let edge = self.e12.get(10);
                    let prun = te.prun(self.e12.sym());
                    if prun <= remaining && self.search3(edge, ct, prun, remaining, 20, 0) {
                        break 'phase3 (i, length123);
                    }
                }
                length123 += 1;
            }
            max_length3 += 1;
        };

        let mut solcube = self.arr2[index].clone();
        let length3 = length123 as usize - solcube.length1 - solcube.length2;
        for &m in &self.move3[..length3] {
            solcube.push_move(MOVE3STD[m]);
        }
        let reduced = CubieCube::from_facelets(&solcube.facelets_333()).expect("reduced 4x4 is a valid 3x3");
        for mv in two_phase::solve(&reduced, 21).expect("21 moves always suffice") {
            solcube.push_move(mv);
        }
        solcube.move_string()
    }

    fn search1(&mut self, ct: usize, sym: usize, maxl: i32, lm: i32, depth: usize) -> bool {
        if ct == 0 && maxl < 5 {
            return maxl == 0 && self.init2(sym);
        }
        let t = center1::tables();
        for axis in (0..27).step_by(3) {
            let axis_i = axis as i32;
            if axis_i == lm || axis_i == lm - 9 || axis_i == lm - 18 {
                continue;
            }
            for power in 0..3 {
                let m = axis + power;
                let ctx = t.ctsmv[ct][t.symmove[sym][m]];
                let prun = i32::from(t.csprun[(ctx >> 6) as usize]);
                if prun >= maxl {
                    if prun > maxl {
                        break;
                    }
                    continue;
                }
                let symx = t.symmult[sym][(ctx & 0x3f) as usize];
                self.move1[depth] = m;
                if self.search1((ctx >> 6) as usize, symx, maxl - 1, axis_i, depth + 1) {
                    return true;
                }
            }
        }
        false
    }

    fn init2(&mut self, mut sym: usize) -> bool {
        let t1 = center1::tables();
        let t2 = center2::tables();
        self.c1 = self.c.clone();
        for &m in &self.move1[..self.length1] {
            self.c1.push_move(m);
        }
        match t1.finish[sym] {
            0 => {
                self.c1.push_move(FX1);
                self.c1.push_move(BX3);
                self.move1[self.length1] = FX1;
                self.move1[self.length1 + 1] = BX3;
                self.add1 = true;
                sym = 19;
            }
            12869 => {
                self.c1.push_move(UX1);
                self.c1.push_move(DX3);
                self.move1[self.length1] = UX1;
                self.move1[self.length1 + 1] = DX3;
                self.add1 = true;
                sym = 34;
            }
            735470 => {
                self.add1 = false;
                sym = 0;
            }
            _ => {}
        }
        let edge_parity = self.c1.edge().parity();
        let center = *self.c1.center();
        self.ct2.set(&center, edge_parity);
        let ctp = i32::from(t2.ctprun[self.ct2.ct_index() * 70 + self.ct2.rl_index()]);
        self.c1.value = ctp + self.length1 as i32;
        self.c1.length1 = self.length1;
        self.c1.add1 = self.add1;
        self.c1.sym = sym;
        self.p1_count += 1;
        if self.p1sols.len() < PHASE2_ATTEMPTS {
            self.p1sols.push(self.c1.clone());
        } else {
            let worst = (0..self.p1sols.len())
                .max_by_key(|&i| self.p1sols[i].value)
                .expect("non-empty");
            if self.p1sols[worst].value > self.c1.value {
                self.p1sols[worst] = self.c1.clone();
            }
        }
        self.p1_count == PHASE1_SOLUTIONS
    }

    fn search2(&mut self, ct: usize, rl: usize, maxl: i32, lm: usize, depth: usize) -> bool {
        let t = center2::tables();
        if ct == 0 && t.ctprun[rl] == 0 && maxl == 0 {
            return self.init3();
        }
        let mt = move_tables();
        let mut m = 0;
        while m < 23 {
            if mt.ckmv2[lm][m] {
                m = mt.skip_axis2[m] + 1;
                continue;
            }
            let ctx = usize::from(t.ctmv[ct][m]);
            let rlx = usize::from(t.rlmv[rl][m]);
            let prun = i32::from(t.ctprun[ctx * 70 + rlx]);
            if prun >= maxl {
                m = if prun > maxl { mt.skip_axis2[m] + 1 } else { m + 1 };
                continue;
            }
            self.move2[depth] = MOVE2STD[m];
            if self.search2(ctx, rlx, maxl - 1, m, depth + 1) {
                return true;
            }
            m += 1;
        }
        false
    }

    fn init3(&mut self) -> bool {
        self.c2 = self.c1.clone();
        for &m in &self.move2[..self.length2] {
            self.c2.push_move(m);
        }
        if !self.c2.edge().check_edge() {
            return false;
        }
        let edge_parity = self.e12.set_cube(self.c2.edge());
        let corner_parity = self.c2.corner().parity();
        let center = *self.c2.center();
        self.ct3.set(&center, edge_parity ^ corner_parity);
        let ct = self.ct3.index();
        let prun = edge3::tables().prun(self.e12.sym());
        let mut stored = self.c2.clone();
        stored.value = (self.length1 + self.length2) as i32 + prun.max(i32::from(center3::tables().prun[ct]));
        stored.length2 = self.length2;
        self.arr2.push(stored);
        self.arr2.len() == PHASE2_SOLUTIONS
    }

    fn search3(&mut self, edge: usize, ct: usize, prun: i32, maxl: i32, lm: usize, depth: usize) -> bool {
        if maxl == 0 {
            return edge == 0 && ct == 0;
        }
        let t3 = center3::tables();
        let te = edge3::tables();
        let mt = move_tables();
        self.tempe[depth].set_index(edge);
        let mut m = 0;
        while m < 17 {
            if mt.ckmv3[lm][m] {
                m = mt.skip_axis3[m] + 1;
                continue;
            }
            let ctx = usize::from(t3.ctmove[ct][m]);
            let prun1 = i32::from(t3.prun[ctx]);
            if prun1 >= maxl {
                m = if prun1 > maxl && m < 14 {
                    mt.skip_axis3[m] + 1
                } else {
                    m + 1
                };
                continue;
            }
            let edgex = te.mvrot(&self.tempe[depth].edge, m << 3, 10);
            let packed = te.raw2sym[edgex / edge3::N_RAW];
            let symx = packed & 0x7;
            let cord2x = te.mvrot(&self.tempe[depth].edge, m << 3 | symx, 10) % edge3::N_RAW;
            let prunx = te.prun_from((packed >> 3) * edge3::N_RAW + cord2x, prun);
            if prunx >= maxl {
                m = if prunx > maxl && m < 14 {
                    mt.skip_axis3[m] + 1
                } else {
                    m + 1
                };
                continue;
            }
            if self.search3(edgex, ctx, prunx, maxl - 1, m, depth + 1) {
                self.move3[depth] = m;
                return true;
            }
            m += 1;
        }
        false
    }
}

pub fn random_state_scramble(rng: &mut Rng) -> Vec<&'static str> {
    Search::new(FullCube::random(rng)).solve()
}

#[cfg(test)]
mod tests {
    use super::moves::MOVE2STR;
    use super::*;

    fn same_up_to_rotation(applied: &FullCube, target: &mut FullCube) -> bool {
        const X: [usize; 2] = [21, 32];
        const Y: [usize; 2] = [18, 29];
        const Z: [usize; 2] = [24, 35];
        let starts: [&[[usize; 2]]; 6] = [&[], &[X], &[X, X], &[X, X, X], &[Z], &[Z, Z, Z]];
        let (edge, center, corner) = (*target.edge(), *target.center(), *target.corner());
        starts.iter().any(|start| {
            (0..4).any(|turns| {
                let mut cube = applied.clone();
                for rotation in start.iter().chain(std::iter::repeat_n(&Y, turns)) {
                    for &m in rotation {
                        cube.push_move(m);
                    }
                }
                *cube.edge() == edge && *cube.center() == center && *cube.corner() == corner
            })
        })
    }

    #[test]
    fn scramble_reaches_the_random_state_up_to_rotation() {
        let mut rng = Rng::seeded(1);
        for _ in 0..6 {
            let mut random = FullCube::random(&mut rng);
            let scramble = Search::new(random.clone()).solve();
            let mut applied = FullCube::solved();
            for name in &scramble {
                applied.push_move(MOVE2STR.iter().position(|m| m == name).unwrap());
            }
            assert!(same_up_to_rotation(&applied, &mut random), "{}", scramble.join(" "));
        }
    }
}
