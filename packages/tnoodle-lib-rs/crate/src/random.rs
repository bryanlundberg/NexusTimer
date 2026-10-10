pub struct Rng {
    s: [u64; 4],
}

fn splitmix64(x: &mut u64) -> u64 {
    *x = x.wrapping_add(0x9e37_79b9_7f4a_7c15);
    let mut z = *x;
    z = (z ^ (z >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
    z = (z ^ (z >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
    z ^ (z >> 31)
}

impl Rng {
    pub fn from_entropy() -> Self {
        let mut bytes = [0u8; 32];
        getrandom::fill(&mut bytes).expect("entropy source unavailable");
        let mut s = [0u64; 4];
        for (word, chunk) in s.iter_mut().zip(bytes.as_chunks::<8>().0) {
            *word = u64::from_le_bytes(*chunk);
        }
        if s == [0; 4] {
            return Self::seeded(0);
        }
        Self { s }
    }

    pub fn seeded(seed: u64) -> Self {
        let mut x = seed;
        Self {
            s: [
                splitmix64(&mut x),
                splitmix64(&mut x),
                splitmix64(&mut x),
                splitmix64(&mut x),
            ],
        }
    }

    pub fn next_u64(&mut self) -> u64 {
        let result = self.s[1].wrapping_mul(5).rotate_left(7).wrapping_mul(9);
        let t = self.s[1] << 17;
        self.s[2] ^= self.s[0];
        self.s[3] ^= self.s[1];
        self.s[1] ^= self.s[2];
        self.s[0] ^= self.s[3];
        self.s[2] ^= t;
        self.s[3] = self.s[3].rotate_left(45);
        result
    }

    pub fn next_u32(&mut self) -> u32 {
        (self.next_u64() >> 32) as u32
    }

    pub fn below(&mut self, n: u32) -> u32 {
        debug_assert!(n > 0);
        let mut m = u64::from(self.next_u32()) * u64::from(n);
        let mut low = m as u32;
        if low < n {
            let threshold = n.wrapping_neg() % n;
            while low < threshold {
                m = u64::from(self.next_u32()) * u64::from(n);
                low = m as u32;
            }
        }
        (m >> 32) as u32
    }

    pub fn below_usize(&mut self, n: usize) -> usize {
        self.below(u32::try_from(n).expect("range too large")) as usize
    }
}

#[cfg(test)]
mod tests {
    use super::Rng;

    #[test]
    fn below_stays_in_range_and_covers_it() {
        let mut rng = Rng::seeded(7);
        let mut seen = [0u32; 12];
        for _ in 0..12_000 {
            seen[rng.below(12) as usize] += 1;
        }
        assert!(seen.iter().all(|&count| (800..1200).contains(&count)));
    }

    #[test]
    fn seeded_is_reproducible() {
        let a: Vec<u64> = {
            let mut rng = Rng::seeded(42);
            (0..4).map(|_| rng.next_u64()).collect()
        };
        let mut rng = Rng::seeded(42);
        assert_eq!(a, (0..4).map(|_| rng.next_u64()).collect::<Vec<_>>());
    }
}
