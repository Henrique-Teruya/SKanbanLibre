import { onBeforeUnmount } from 'vue'

/**
 * Composable to handle auto-scrolling an element during drag-and-drop.
 * @param {import('vue').Ref<HTMLElement>} elementRef - The scrollable element
 * @param {Object} options
 * @param {number} options.threshold - Distance from edge to start scrolling (default: 100)
 * @param {number} options.speed - Max scroll speed (default: 15)
 * @param {'horizontal' | 'vertical'} options.direction - Scroll direction (default: 'horizontal')
 */
export function useAutoScroll(elementRef, { threshold = 100, speed = 15, direction = 'horizontal' } = {}) {
  let scrollInterval = null
  let currentSpeed = 0

  function stop() {
    if (scrollInterval) {
      clearInterval(scrollInterval)
      scrollInterval = null
    }
    currentSpeed = 0
  }

  function start() {
    if (scrollInterval) return
    scrollInterval = setInterval(() => {
      if (elementRef.value && currentSpeed !== 0) {
        if (direction === 'horizontal') {
          elementRef.value.scrollLeft += currentSpeed
        } else {
          elementRef.value.scrollTop += currentSpeed
        }
      }
    }, 16)
  }

  function handleDragOver(e) {
    if (!elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    let mousePos, size
    
    if (direction === 'horizontal') {
      mousePos = e.clientX - rect.left
      size = rect.width
    } else {
      mousePos = e.clientY - rect.top
      size = rect.height
    }
    
    let newSpeed = 0
    if (mousePos < threshold) {
      newSpeed = -speed * (1 - Math.max(0, mousePos) / threshold)
    } else if (mousePos > size - threshold) {
      newSpeed = speed * (1 - Math.max(0, size - mousePos) / threshold)
    }

    currentSpeed = newSpeed
    if (currentSpeed !== 0) {
      start()
    } else {
      stop()
    }
  }

  onBeforeUnmount(() => {
    stop()
  })

  return {
    handleDragOver,
    stopAutoScroll: stop
  }
}
