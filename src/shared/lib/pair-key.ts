/** Order-independent key for two user ids, so a pair maps to a single document. */
export const pairKeyOf = (a: string, b: string) => (a < b ? `${a}:${b}` : `${b}:${a}`)
