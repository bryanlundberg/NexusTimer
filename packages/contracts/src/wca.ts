export const WCA_LINK_STATUSES = ['success', 'error', 'no-id', 'taken'] as const

export type WcaLinkStatus = (typeof WCA_LINK_STATUSES)[number]
