<script setup>
import { computed, onMounted } from 'vue'
import { useSKanbanStore } from '@/stores/skanban'
import { useEmitter } from '@/composables/useEmitter'
import KanbanColumn from './KanbanColumn.vue'

const store = useSKanbanStore()
const emitter = useEmitter()

const columns = computed(() => {
  const grouped = store.filteredGroupedByStatus
  return Object.values(grouped)
})

async function onDrop(uuid, newStatusName) {
  await store.moveCard(uuid, newStatusName)
}

function onOpenDrawer(conversation) {
  store.openDrawer(conversation)
}

onMounted(async () => {
  await store.init(emitter)
})
</script>

<template>
  <section class="sk-board">
    <KanbanColumn
      v-for="(col, i) in columns"
      :key="col.status.id"
      :status="col.status"
      :conversations="col.conversations"
      :index="i"
      @drop="onDrop"
      @open-drawer="onOpenDrawer"
    />
    <div v-if="store.loading && columns.length === 0" class="sk-empty" style="flex:1">
      <p style="animation: sk-pulse 1.5s infinite">Carregando board...</p>
    </div>
  </section>
</template>
