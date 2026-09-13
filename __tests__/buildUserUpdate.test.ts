import { buildUserUpdate } from '@/entities/user/lib/build-user-update'

describe('buildUserUpdate', () => {
  it('sets values and unsets nulls and empty arrays', () => {
    expect(buildUserUpdate({ name: 'Mateo', bio: null, links: [], mainColors: ['white'], goal: undefined })).toEqual({
      $set: { name: 'Mateo', mainColors: ['white'] },
      $unset: { bio: '', links: '' }
    })
  })

  it('omits empty operators', () => {
    expect(buildUserUpdate({ image: 'https://example.com/a.png' })).toEqual({
      $set: { image: 'https://example.com/a.png' }
    })
    expect(buildUserUpdate({ country: null })).toEqual({ $unset: { country: '' } })
  })

  it('returns null when nothing changes', () => {
    expect(buildUserUpdate({})).toBeNull()
    expect(buildUserUpdate({ bio: undefined })).toBeNull()
  })
})
