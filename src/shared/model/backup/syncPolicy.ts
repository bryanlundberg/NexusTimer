import moment from 'moment'

/**
 * Shared policy/constants for the backup sync flows (auto-restore on login and
 * the periodic backup suggestion toast).
 */
export const SYNC_COOLDOWN_MINUTES = 5
export const SYNC_TOAST_DURATION_MS = 8000
export const SYNC_TOAST_ID = 'sync-toast-id'

/**
 * Anti-spam guard: returns true only when the last sync happened more than
 * SYNC_COOLDOWN_MINUTES ago (or never).
 */
export const isSyncCooldownElapsed = (lastSync: number): boolean =>
  moment(lastSync || 0).isBefore(moment().subtract(SYNC_COOLDOWN_MINUTES, 'minutes'))
