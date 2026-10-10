pub trait Budget {
    fn spend(&mut self) -> bool;
    fn is_spent(&self) -> bool;
}

pub struct Unlimited;

impl Budget for Unlimited {
    #[inline(always)]
    fn spend(&mut self) -> bool {
        true
    }

    #[inline(always)]
    fn is_spent(&self) -> bool {
        false
    }
}

pub struct NodeBudget(u64);

impl NodeBudget {
    pub fn new(nodes: u64) -> Self {
        Self(nodes)
    }

    pub fn remaining(&self) -> u64 {
        self.0
    }
}

impl Budget for NodeBudget {
    fn spend(&mut self) -> bool {
        if self.0 == 0 {
            return false;
        }
        self.0 -= 1;
        true
    }

    fn is_spent(&self) -> bool {
        self.0 == 0
    }
}

#[derive(Debug, PartialEq, Eq)]
pub enum Outcome {
    Found(Vec<usize>),
    NoneWithinLength,
    OutOfBudget,
}
