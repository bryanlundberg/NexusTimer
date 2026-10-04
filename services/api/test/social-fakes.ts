import { type FriendUser, type PrivacySettings, resolvePrivacy } from '@nexustimer/contracts'
import { pairKeyOf } from '../src/lib/pair-key'
import type { FriendsRepository, StoredFriendship } from '../src/modules/social/friends.repository'

type Person = FriendUser & { email?: string }

export const people: Record<string, Person> = {
  ana: { _id: 'ana', name: 'Ana <3', image: '/a.png', wcaId: '2020ANAA01', email: 'ana@test.dev', bio: 'hi' },
  ben: { _id: 'ben', name: 'Ben', image: 'https://cdn.test/b.png', email: 'ben@test.dev', method: 'CFOP' },
  cam: { _id: 'cam', name: 'Cam', image: '', email: 'cam@test.dev' },
  dan: { _id: 'dan', name: 'Dan', image: '' },
  eve: { _id: 'eve', name: 'Eve', image: '' },
  fay: { _id: 'fay', name: 'Fay', image: '' }
}

export function fakeFriendships() {
  const docs = new Map<string, StoredFriendship>()
  const emails = new Set<string>()
  let seq = 0
  const stamp = () => new Date(Date.UTC(2026, 0, 1, 0, 0, ++seq))
  const entry = (id: string) => [...docs.entries()].find(([, doc]) => doc.id === id)

  const repository: FriendsRepository = {
    async acceptedFriendIds(userId) {
      return [...docs.values()]
        .filter((doc) => doc.status === 'accepted' && doc.users.includes(userId))
        .map((doc) => doc.users.find((id) => id !== userId)!)
    },
    async listForUser(userId) {
      return [...docs.values()]
        .filter((doc) => doc.users.includes(userId))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    },
    async findPair(userId, otherId) {
      const doc = docs.get(pairKeyOf(userId, otherId))
      return doc ? { ...doc } : null
    },
    async createRequest(requesterId, otherId) {
      const key = pairKeyOf(requesterId, otherId)
      if (docs.has(key)) return 'duplicate'
      const createdAt = stamp()
      docs.set(key, { id: `f${seq}`, users: [requesterId, otherId], requesterId, status: 'pending', createdAt })
      return 'created'
    },
    async accept(id, from) {
      const found = entry(id)
      if (!found || found[1].status !== from) return false
      const { withdrawnAt: _, ...rest } = found[1]
      docs.set(found[0], { ...rest, status: 'accepted', acceptedAt: stamp() })
      return true
    },
    async decline(id) {
      const found = entry(id)
      if (found?.[1].status === 'pending') found[1].status = 'declined'
    },
    async withdraw(id) {
      const found = entry(id)
      if (found?.[1].status === 'declined') found[1].withdrawnAt = stamp()
    },
    async clearWithdrawn(id) {
      const found = entry(id)
      if (found) delete found[1].withdrawnAt
    },
    async deleteById(id, status) {
      const found = entry(id)
      if (found && (!status || found[1].status === status)) docs.delete(found[0])
    },
    async deletePair(userId, otherId) {
      const key = pairKeyOf(userId, otherId)
      const doc = docs.get(key)
      docs.delete(key)
      return doc?.status ?? null
    },
    async claimRequestEmail(senderId, recipientId) {
      const key = pairKeyOf(senderId, recipientId)
      if (emails.has(key)) return false
      emails.add(key)
      return true
    }
  }

  function befriend(a: string, b: string) {
    const createdAt = stamp()
    docs.set(pairKeyOf(a, b), {
      id: `f${seq}`,
      users: [a, b],
      requesterId: a,
      status: 'accepted',
      createdAt,
      acceptedAt: createdAt
    })
  }

  return { repository, docs, befriend }
}

export function fakeUsers(privacy: Record<string, Partial<PrivacySettings>> = {}) {
  const card = ({ _id, name, image, country, wcaId }: Person): FriendUser => ({
    _id,
    name,
    image,
    ...(country ? { country } : {}),
    ...(wcaId ? { wcaId } : {})
  })
  const profile = ({ email: _, ...user }: Person): FriendUser => user

  return {
    exists: async (id: string) => id in people,
    async friendUsers(ids: string[], withProfile = false) {
      const known = ids.filter((id) => id in people)
      return new Map(known.map((id) => [id, withProfile ? profile(people[id]!) : card(people[id]!)]))
    },
    privacy: async (id: string) => resolvePrivacy(privacy[id]),
    async mailContact(id: string) {
      const person = people[id]
      return person ? { email: person.email ?? null, privacy: resolvePrivacy(privacy[id]) } : null
    }
  }
}
