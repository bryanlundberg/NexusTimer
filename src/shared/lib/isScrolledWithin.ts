export function isScrolledWithin(from: Node, scroller: HTMLElement) {
  for (let el = from instanceof Element ? from : from.parentElement; el; el = el.parentElement) {
    if (el.scrollTop > 0) return true
    if (el === scroller) return false
  }
  return false
}
