<script setup>
import { ref } from 'vue'
import KanbanCard from './KanbanCard.vue'

const props = defineProps({
  status: { type: Object, required: true },
  conversations: { type: Array, default: () => [] },
  index: { type: Number, default: 0 }
})

const emit = defineEmits(['drop', 'open-drawer'])

const isDragOver = ref(false)

const statusColors = {
  Open: '#0071e3',
  Pending: '#ff9f0a',
  Resolved: '#30d158',
  Closed: '#86868b',
  Snoozed: '#af52de'
}

function getColor() {
  return statusColors[props.status.name] || '#0071e3'
}

function onDragOver(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
  isDragOver.value = true
}

function onDragLeave(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    isDragOver.value = false
  }
}

function onDrop(e) {
  e.preventDefault()
  isDragOver.value = false
  const uuid = e.dataTransfer.getData('text/plain')
  if (uuid) {
    emit('drop', uuid, props.status.name)
  }
}
</script>

<template>
  <div
    class="sk-column"
    :class="{ 'drag-over': isDragOver }"
    :style="{ animationDelay: index * 0.06 + 's' }"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div class="sk-column-header">
      <div class="sk-column-title">
        <span class="dot" :style="{ background: getColor() }" />
        <h3>{{ status.name }}</h3>
      </div>
      <span class="sk-column-count">{{ conversations.length }}</span>
    </div>
    <div class="sk-cards">
      <KanbanCard
        v-for="(conv, i) in conversations"
        :key="conv.uuid"
        :conversation="conv"
        :style="{ animationDelay: i * 0.03 + 's' }"
        @open-drawer="(c) => emit('open-drawer', c)"
      />
      <div v-if="conversations.length === 0" class="sk-empty">
        <p>Nenhuma conversa</p>
      </div>
    </div>
  </div>
</template>
