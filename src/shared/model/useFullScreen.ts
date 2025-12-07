export function useFullScreen() {
  const toggleFullScreen = () => {
    const element = document.documentElement

    if (!document.fullscreenElement) {
      // Enter full-screen mode
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if ((element as any).mozRequestFullScreen) {
        ;(element as any).mozRequestFullScreen()
      } else if ((element as any).webkitRequestFullscreen) {
        ;(element as any).webkitRequestFullscreen()
      } else if ((element as any).msRequestFullscreen) {
        ;(element as any).msRequestFullscreen()
      }
    } else {
      // Exit full-screen mode
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        // Use type assertion for older Firefox
        ;(document as any).mozCancelFullScreen()
      } else if ((document as any).webkitExitFullscreen) {
        ;(document as any).webkitExitFullscreen()
      } else if ((document as any).msExitFullscreen) {
        // Use type assertion for older IE
        ;(document as any).msExitFullscreen()
      }
    }
  }

  return { toggleFullScreen }
}
