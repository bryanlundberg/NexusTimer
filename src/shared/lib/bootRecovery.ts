import { AUTH_SESSION_CACHE } from '@/shared/lib/authSessionCache'

declare global {
  interface Window {
    __nxBooted?: boolean
  }
}

export const RECOVERY_KEY = 'nx-boot-recovery'
export const BOOT_TIMEOUT_MS = 5000

// Plain ES5 that runs from the server HTML before any bundle: if the app never hydrates while online,
// drop service workers and their caches (never IndexedDB) and reload once per tab session.
export const BOOT_RECOVERY_SCRIPT = `(function () {
  setTimeout(function () {
    if (window.__nxBooted || !navigator.onLine) return;
    try {
      if (sessionStorage.getItem('${RECOVERY_KEY}')) return;
      sessionStorage.setItem('${RECOVERY_KEY}', '1');
    } catch (e) {
      return;
    }
    var tasks = [];
    if (navigator.serviceWorker) {
      tasks.push(navigator.serviceWorker.getRegistrations().then(function (registrations) {
        return Promise.all(registrations.map(function (registration) { return registration.unregister(); }));
      }));
    }
    if (window.caches) {
      tasks.push(window.caches.keys().then(function (keys) {
        return Promise.all(keys.filter(function (key) { return key !== '${AUTH_SESSION_CACHE}'; }).map(function (key) {
          return window.caches.delete(key);
        }));
      }));
    }
    Promise.all(tasks).catch(function () {}).then(function () { location.reload(); });
  }, ${BOOT_TIMEOUT_MS});
})();`

export function markBooted() {
  window.__nxBooted = true
  try {
    sessionStorage.removeItem(RECOVERY_KEY)
  } catch {}
}
