import confetti from 'canvas-confetti'

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function fireConfetti() {
  const duration = 1000
  const animationEnd = Date.now() + duration
  const colors = ['#bb0000', '#ffffff']

  ;(function frame() {
    const timeLeft = animationEnd - Date.now()
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    })
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    })

    if (timeLeft > 0) {
      requestAnimationFrame(frame)
    }
  })()
}
