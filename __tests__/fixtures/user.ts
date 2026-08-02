import { UserProfile } from '@/entities/user/model/user'

/**
 * `createdAt` defaults to well after the launch-window cutoff (2025-07-11) so
 * the `first-year` badge stays locked unless a test opts into it.
 */
export function makeUser(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    _id: 'user-1',
    name: 'Tester',
    email: 'tester@example.com',
    image: '',
    providers: [],
    createdAt: new Date('2030-01-01'),
    updatedAt: new Date('2030-01-01'),
    __v: 0,
    ...overrides
  }
}
