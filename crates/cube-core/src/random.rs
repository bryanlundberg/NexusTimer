pub trait RandomSource {
    fn below_usize(&mut self, n: usize) -> usize;
}

pub struct SplitMix64(u64);

impl SplitMix64 {
    pub fn new(seed: u64) -> Self {
        Self(seed)
    }

    pub fn next_u64(&mut self) -> u64 {
        self.0 = self.0.wrapping_add(0x9e37_79b9_7f4a_7c15);
        let mut z = self.0;
        z = (z ^ (z >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
        z ^ (z >> 31)
    }
}

impl RandomSource for SplitMix64 {
    fn below_usize(&mut self, n: usize) -> usize {
        (self.next_u64() % n as u64) as usize
    }
}
