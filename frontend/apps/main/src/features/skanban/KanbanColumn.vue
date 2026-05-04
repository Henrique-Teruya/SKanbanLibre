<script setup>
import KanbanCard from './KanbanCard.vue'
import { useSKanbanStore } from '@/stores/skanban'

const props = defineProps({
  status: { type: Object, required: true },
  conversations: { type: Array, default: () => [] }
})

const store = useSKanbanStore()

function onDrop(e) {
  const uuid = e.dataTransfer.getData('text/plain')
  store.moveCard(uuid, props.status.name)
  e.currentTarget.classList.remove('drag-over')
}

function onDragOver(e) {
  e.preventDefault()
  e.currentTarget.classList.add('drag-over')
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('drag-over')
}

function onOpenDrawer(conv) {
  store.openDrawer(conv)
}
</script>

<template>
  <div
    class="sk-column"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="sk-column-header">
      <div class="sk-column-title">
        <span class="dot" :style="{ background: status.color || 'var(--skr-blue)' }"></span>
        <h3>{{ status.name }}</h3>
      </div>
      <span class="sk-column-count">{{ conversations.length }}</span>
    </div>

    <div class="sk-cards">
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
