export const DIAGNOSTICS_KEY = 'nx-diag'

declare global {
  interface Window {
    __nxDiag?: (type: string, detail?: unknown) => void
  }
}

// Plain ES5 that runs from the server HTML before any bundle. It keeps the last page loads in
// localStorage on this device only, so /repair.html can show them when the app renders nothing.
export const DIAGNOSTICS_SCRIPT = `(function () {
  var KEY = '${DIAGNOSTICS_KEY}';
  var entry = { url: location.href, start: Date.now(), events: [] };
  var runs = [];
  try { runs = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}
  runs.push(entry);
  runs = runs.slice(-3);
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(runs)); } catch (e) {} };
  var text = function (value) {
    try {
      if (value && value.stack) return String(value.stack);
      if (value && typeof value === 'object') return JSON.stringify(value);
      return String(value);
    } catch (e) {
      return String(value);
    }
  };
  var add = function (type, detail) {
    if (entry.events.length >= 40) return;
    entry.events.push({ t: Date.now() - entry.start, type: type, detail: text(detail === undefined ? '' : detail).slice(0, 500) });
    save();
  };
  window.__nxDiag = add;
  add('html', '');
  window.addEventListener('error', function (event) {
    var target = event.target;
    if (target && target !== window && (target.src || target.href)) return add('resource', target.src || target.href);
    add('error', (event.message || '') + ' @ ' + (event.filename || '') + ':' + (event.lineno || '') + ' ' + text(event.error || ''));
  }, true);
  window.addEventListener('unhandledrejection', function (event) { add('rejection', event.reason); });
  var consoleError = console.error;
  console.error = function () {
    try { add('console', Array.prototype.map.call(arguments, text).join(' ')); } catch (e) {}
    return consoleError.apply(console, arguments);
  };
  document.addEventListener('DOMContentLoaded', function () { add('dom', ''); });
  window.addEventListener('load', function () { add('load', ''); });
  setTimeout(function () {
    add('snapshot', 'visibleText=' + (document.body ? document.body.innerText.trim().length : -1) + ' nextRuntime=' + !!window.next);
  }, 8000);
})();`
