type Detected = { name?: string; version?: string }
type Pattern = [name: string, pattern: RegExp]

const BROWSERS: Pattern[] = [
  ['Edge', /\bEdg(?:e|A|iOS)?\/([\d.]+)/],
  ['Opera', /\b(?:OPR|Opera)\/([\d.]+)/],
  ['Samsung Internet', /\bSamsungBrowser\/([\d.]+)/],
  ['Firefox', /\b(?:Firefox|FxiOS)\/([\d.]+)/],
  ['Chrome', /\b(?:Chrome|CriOS)\/([\d.]+)/],
  ['Safari', /\bVersion\/([\d.]+).*\bSafari\//]
]

const SYSTEMS: Pattern[] = [
  ['Windows', /\bWindows NT ([\d.]+)/],
  ['iOS', /\b(?:iPhone|iPad|iPod)\b.*? OS ([\d_]+)/],
  ['Android', /\bAndroid ([\d.]+)/],
  ['Chrome OS', /\bCrOS \S+ ([\d.]+)/],
  ['macOS', /\bMac OS X ([\d_.]+)/],
  ['Linux', /\bLinux\b/]
]

const MOBILE_VARIANTS = new Set(['Chrome', 'Firefox', 'Safari'])

const WINDOWS_VERSIONS: Record<string, string> = { '10.0': '10', '6.3': '8.1', '6.2': '8', '6.1': '7' }

function detect(userAgent: string, patterns: Pattern[]): Detected {
  for (const [name, pattern] of patterns) {
    const match = userAgent.match(pattern)
    if (match) return { name, version: match[1]?.replaceAll('_', '.') }
  }
  return {}
}

export function parseUserAgent(userAgent: string) {
  const os = detect(userAgent, SYSTEMS)
  if (os.name === 'Windows' && os.version) os.version = WINDOWS_VERSIONS[os.version] ?? os.version
  const browser = detect(userAgent, BROWSERS)
  if (browser.name && MOBILE_VARIANTS.has(browser.name) && /\bMobile\b/.test(userAgent)) {
    browser.name = `Mobile ${browser.name}`
  }
  return { os, browser }
}
