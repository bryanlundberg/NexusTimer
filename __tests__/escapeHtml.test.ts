import { describe, expect, it } from 'vitest'
import { escapeHtml } from '@/shared/lib/escapeHtml'

describe('escapeHtml', () => {
  it('neutralizes markup in user text', () => {
    expect(escapeHtml('<img src=x onerror="alert(1)">')).toBe('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;')
    expect(escapeHtml("Tom's & Jerry's")).toBe('Tom&#39;s &amp; Jerry&#39;s')
  })

  it('leaves plain names untouched', () => {
    expect(escapeHtml('3x3 Main')).toBe('3x3 Main')
  })
})
