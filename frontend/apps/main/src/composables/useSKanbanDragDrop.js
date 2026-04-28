import { ref } from 'vue'

/**
 * Composable for HTML5 drag-and-drop on the Kanban board.
 * @param {Function} onMove - callback(uuid, targetStatusName) when a card is dropped
 */
export function useSKanbanDragDrop(onMove) {
  const draggedUuid = ref(null)

  function startDrag(event, conversation) {
    draggedUuid.value = conversation.uuid
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', conversation.uuid)

    // Custom ghost
    const ghost = event.target.cloneNode(true)
    ghost.style.width = event.target.offsetWidth + 'px'
    ghost.style.opacity = '0.85'
    ghost.style.transform = 'rotate(2deg)'
    ghost.style.position = 'absolute'
    ghost.style.top = '-1000px'
    document.body.appendChild(ghost)
    event.dataTransfer.setDragImage(ghost, 20, 20)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  function onDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  function onDrop(event, targetStatusName) {
    event.preventDefault()
    const uuid = event.dataTransfer.getData('text/plain')
    if (uuid && onMove) {
      onMove(uuid, targetStatusName)
    }
    draggedUuid.value = null
  }

  function onDragEnd() {
    draggedUuid.value = null
  }

  return {
    draggedUuid,
    startDrag,
    onDragOver,
    onDrop,
    onDragEnd
  }
}
