<script setup>
import { ref } from 'vue'
import KanbanCard from './KanbanCard.vue'
import { useSKanbanStore } from '@/stores/skanban'
import { useAutoScroll } from '@/composables/useAutoScroll'

const props = defineProps({
  status: { type: Object, required: true },
  conversations: { type: Array, default: () => [] }
})

const store = useSKanbanStore()

const cardsRef = ref(null)
const { handleDragOver: scrollCards, stopAutoScroll } = useAutoScroll(cardsRef, { 
  direction: 'vertical', 
  threshold: 80,
  speed: 12
})

function onDrop(e) {
  const uuid = e.dataTransfer.getData('text/plain')
  store.moveCard(uuid, props.status.id)
  e.currentTarget.classList.remove('drag-over')
  stopAutoScroll()
}

function onDragOver(e) {
  e.preventDefault()
  e.currentTarget.classList.add('drag-over')
  scrollCards(e)
}

function onDragLeave(e) {
  // Only remove class and stop scroll if we are actually leaving the column
  if (!e.currentTarget.contains(e.relatedTarget)) {
    e.currentTarget.classList.remove('drag-over')
    stopAutoScroll()
  }
}

function onOpenDrawer(conv) {
  store.openDrawer(conv)
}
</script>

<template>
  <div
    class="sk-column"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div class="sk-column-header">
      <div class="sk-column-title">
        <h3>{{ status.name }}</h3>
      </div>
      <span class="sk-column-count">{{ conversations.length }}</span>
    </div>

    <div ref="cardsRef" class="sk-cards">
      <KanbanCard
        v-for="conv in conversations"
        :key="conv.uuid"
        :conversation="conv"
        @open-drawer="onOpenDrawer"
      />
      
      <div v-if="conversations.length === 0" class="sk-empty-col">
        <p>Nenhuma conversa</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sk-column {
  transition: background 0.2s ease;
}
.sk-column.drag-over {
  background: rgba(0, 113, 227, 0.05);
}
.sk-empty-col {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 13px;
  font-weight: 500;
}
</style>
