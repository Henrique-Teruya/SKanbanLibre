<script setup>
import { computed, onMounted, ref } from 'vue'
import { useSKanbanStore } from '@/stores/skanban'
import { useEmitter } from '@/composables/useEmitter'
import { useAutoScroll } from '@/composables/useAutoScroll'
import KanbanColumn from './KanbanColumn.vue'

const store = useSKanbanStore()
const emitter = useEmitter()

const boardRef = ref(null)
const { handleDragOver, stopAutoScroll } = useAutoScroll(boardRef)

const columns = computed(() => {
  const grouped = store.filteredGroupedByStatus
  return Object.values(grouped)
})

function onOpenDrawer(conversation) {
  store.openDrawer(conversation)
}

function onDragLeave(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    stopAutoScroll()
  }
}

onMounted(async () => {
  await store.init(emitter)
})
</script>

<template>
  <section 
    ref="boardRef"
    class="sk-board"
    @dragover="handleDragOver"
    @drop="stopAutoScroll"
    @dragend="stopAutoScroll"
    @dragleave="onDragLeave"
  >
    <KanbanColumn
      v-for="(col, i) in columns"
      :key="col.status.id"
      :status="col.status"
      :conversations="col.conversations"
      :index="i"
      @open-drawer="onOpenDrawer"
    />
    <div v-if="store.loading && columns.length === 0" class="sk-empty" style="flex:1">
      <p style="animation: sk-pulse 1.5s infinite">Carregando board...</p>
    </div>
  </section>
</template>
