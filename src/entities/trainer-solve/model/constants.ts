export const TRAINER_PENALTIES = ['OK', '+2', 'DNF'] as const
export type TrainerPenalty = (typeof TRAINER_PENALTIES)[number]
