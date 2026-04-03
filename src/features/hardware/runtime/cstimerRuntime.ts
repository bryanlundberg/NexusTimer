/**
 * Provides the global environment that cstimer vendor scripts expect.
 * Must be called before loading any script from /public/vendors/cstimer/.
 */

export interface CstimerRuntimeOptions {
  /** Enable cstimer's internal DEBUG logging */
  debug?: boolean
  /** Whether to use the signal header byte from the stackmat protocol */
  stkHead?: boolean
}

export function initCstimerRuntime(options: CstimerRuntimeOptions = {}): void {
  const w = window as unknown as Record<string, unknown>

  // execMain is cstimer's module wrapper — it just calls the factory and returns the result
  w['execMain'] = (fn: () => unknown) => fn()

  // Subset of jQuery used by cstimer hardware files
  w['$'] = {
    now: () => Date.now(),
    noop: () => {},
    isArray: Array.isArray
  }

  w['DEBUG'] = options.debug ?? false

  // kernel.getProp reads cstimer settings — we expose only what the hardware layer needs
  w['kernel'] = {
    getProp: (key: string) => {
      if (key === 'stkHead') return options.stkHead ?? false
      return undefined
    }
  }
}

/**
 * Injects a vendor script as a <script> tag and resolves when loaded.
 * Safe to call multiple times for the same src — it won't load twice.
 */
export function loadVendorScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('loadVendorScript requires a browser environment'))
      return
    }

    if (document.querySelector(`script[data-cstimer-vendor="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.setAttribute('data-cstimer-vendor', src)
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load cstimer vendor script: ${src}`))
    document.head.appendChild(script)
  })
}
