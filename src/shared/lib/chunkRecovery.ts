export const CHUNK_RECOVERY_KEY = 'nx-chunk-recovery'
export const CHUNK_RECOVERY_MAX_ATTEMPTS = 2
export const CHUNK_RECOVERY_BATCH_MS = 100

// Plain ES5 that runs from the server HTML before any bundle. Vercel answers a missing build asset
// with a 404 the browser caches for hours, so a load during a deploy or rollback can pin a stale
// failure. Refetching the failed assets with cache: 'reload' overwrites that cached 404, then the
// page reloads with working files. Bounded per tab session so it can never loop.
export const CHUNK_RECOVERY_SCRIPT = `(function () {
  var KEY = '${CHUNK_RECOVERY_KEY}';
  var failed = [];
  var timer = null;
  var recover = function () {
    var attempts = 0;
    try {
      attempts = Number(sessionStorage.getItem(KEY) || 0);
      if (attempts >= ${CHUNK_RECOVERY_MAX_ATTEMPTS}) return;
      sessionStorage.setItem(KEY, String(attempts + 1));
    } catch (e) {
      return;
    }
    Promise.all(failed.map(function (url) {
      return fetch(url, { cache: 'reload' }).catch(function () {});
    })).then(function () { location.reload(); });
  };
  window.addEventListener('error', function (event) {
    var target = event.target;
    if (!target || target === window || !navigator.onLine) return;
    var url = target.tagName === 'SCRIPT' ? target.src : target.tagName === 'LINK' ? target.href : '';
    if (!url || url.indexOf('/_next/static/') === -1 || failed.indexOf(url) > -1) return;
    failed.push(url);
    if (!timer) timer = setTimeout(recover, ${CHUNK_RECOVERY_BATCH_MS});
  }, true);
})();`
