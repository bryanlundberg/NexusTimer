import { Categories } from '@/interfaces/Categories';

export type CompareUser = {
  [key in Categories]: { single: number; average: number; count: number };
} & {
  _id: string;
};
