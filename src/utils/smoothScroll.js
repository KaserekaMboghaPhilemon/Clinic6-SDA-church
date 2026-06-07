/*
  Smooth scroll utility with a fixed easing curve and duration.
  This keeps scroll feel consistent across phone, tablet, and desktop.
*/
export function smoothScrollToElement(element, duration = 650) {
  if (!element || typeof window === 'undefined') return

  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    element.scrollIntoView({ behavior: 'auto', block: 'start' })
    return
  }

  const startY = window.scrollY || window.pageYOffset
  const targetY = element.getBoundingClientRect().top + startY
  const distance = targetY - startY
  const startTime = performance.now()

  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

  const step = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeInOutCubic(progress)

    window.scrollTo(0, startY + distance * eased)

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

export function smoothScrollToId(id, duration = 650) {
  if (!id || typeof document === 'undefined') return
  const target = document.getElementById(id)
  if (!target) return
  smoothScrollToElement(target, duration)
}
