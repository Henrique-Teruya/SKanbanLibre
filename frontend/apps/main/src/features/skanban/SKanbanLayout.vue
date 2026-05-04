<script setup>
import { ref, onMounted } from 'vue'
import SKanbanTopBar from './SKanbanTopBar.vue'
import SKanbanFilterBar from './SKanbanFilterBar.vue'
import KanbanBoard from './KanbanBoard.vue'
import SKanbanDrawer from './SKanbanDrawer.vue'
import CreateConversation from '@/features/conversation/CreateConversation.vue'
import { useSKanbanStore } from '@/stores/skanban'
import { useEmitter } from '@/composables/useEmitter'
import './skanban.css'

const store = useSKanbanStore()
const emitter = useEmitter()
const showFilters = ref(true)
const showCreateModal = ref(false)

const viewTitles = {
  kanban: 'Kanban'
}

function onSearch(query) {
  store.setSearchQuery(query)
}

function onFilterChange(filters) {
  Object.keys(filters).forEach((key) => {
    store.setFilter(key, filters[key])
  })
}

function onCloseDrawer() {
  store.closeDrawer()
}

function openNewConversation() {
  showCreateModal.value = true
}

onMounted(() => {
  store.init(emitter)
})
</script>

<template>
  <div class="skanban-root" style="height: 100%; width: 100%; display: flex; flex-direction: column; overflow: hidden; position: relative;">
    <!-- Background blobs -->
    <div class="sk-bg-blobs">
      <div class="blob-extra"></div>
    </div>
    <div class="sk-bg-grid"></div>

    <!-- Layout -->
    <div class="sk-layout">
      <div class="sk-main">
        <SKanbanTopBar
          :title="viewTitles.kanban"
          :show-search="true"
          :show-new-button="true"
          @search="onSearch"
          @new-conversation="openNewConversation"
        />

        <SKanbanFilterBar
          :visible="showFilters"
          @filter-change="onFilterChange"
        />

        <!-- Views -->
        <KanbanBoard />
      </div>
    </div>

    <!-- Drawer -->
    <SKanbanDrawer
      :conversation="store.drawerConversation"
      :open="store.isDrawerOpen"
      @close="onCloseDrawer"
    />

    <!-- Create Modal -->
    <CreateConversation v-model="showCreateModal" v-if="showCreateModal" />
  </div>
</template>

<style scoped>
.sk-fade-slide-enter-active,
.sk-fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.sk-fade-slide-enter-from {
  opacity: 0;
  transform: translateY(0.625rem);
}

.sk-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-0.625rem);
}
</style>
