import { inspectionLabel, inspectionPenalty } from '@/features/timer/lib/inspection'

describe('inspectionLabel', () => {
  it('counts down whole seconds rounded up', () => {
    expect(inspectionLabel(15)).toBe('15')
    expect(inspectionLabel(14.2)).toBe('15')
    expect(inspectionLabel(14)).toBe('14')
    expect(inspectionLabel(0.3)).toBe('1')
  })

  it('never shows 0 while the inspection time is not over', () => {
    expect(inspectionLabel(0)).toBe('1')
  })

  it('shows +2 during the 2 seconds after the inspection time', () => {
    expect(inspectionLabel(-0.01)).toBe('+2')
    expect(inspectionLabel(-2)).toBe('+2')
  })

  it('shows DNF after that', () => {
    expect(inspectionLabel(-2.01)).toBe('DNF')
    expect(inspectionLabel(-60)).toBe('DNF')
  })
})

describe('inspectionPenalty', () => {
  it('follows the WCA limits around the configured time', () => {
    expect(inspectionPenalty(3)).toBe('none')
    expect(inspectionPenalty(0)).toBe('none')
    expect(inspectionPenalty(-1)).toBe('plus2')
    expect(inspectionPenalty(-2)).toBe('plus2')
    expect(inspectionPenalty(-2.5)).toBe('dnf')
  })
})
