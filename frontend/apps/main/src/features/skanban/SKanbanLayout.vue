<script setup>
import { computed, ref } from 'vue'
import { useSKanbanStore } from '@/stores/skanban'
import { debounce } from './skanbanUtils'
import CreateConversation from '@/features/conversation/CreateConversation.vue'
import SKanbanSidebar from './SKanbanSidebar.vue'
import SKanbanTopBar from './SKanbanTopBar.vue'
import SKanbanFilterBar from './SKanbanFilterBar.vue'
import KanbanBoard from './KanbanBoard.vue'
import SKanbanDashboard from './SKanbanDashboard.vue'
import SKanbanDrawer from './SKanbanDrawer.vue'
import './skanban.css'

const store = useSKanbanStore()
const createConversationRef = ref(null)

const viewTitles = { kanban: 'Kanban', dashboard: 'Dashboard', conversas: 'Conversas' }
const title = computed(() => viewTitles[store.activeView] || 'SKanban')
const showFilters = computed(() => store.activeView === 'kanban')

function navigate(view) {
  store.setActiveView(view)
}

const onSearch = debounce((query) => {
  store.setSearchQuery(query)
}, 400)

function onFilterChange(filters) {
  store.clearFilters()
  Object.entries(filters).forEach(([key, value]) => {
    store.setFilter(key, value)
  })
}

function onCloseDrawer() {
  store.closeDrawer()
}

function openNewConversation() {
  createConversationRef.value?.open()
}
</script>

<template>
  <div class="skanban-root" style="height: 100%; width: 100%">
    <!-- Background blobs -->
    <div class="sk-bg-blobs" />

    <!-- Layout -->
    <div class="sk-layout">
      <SKanbanSidebar
        :active-view="store.activeView"
        :kanban-count="store.openCount"
        @navigate="navigate"
      />

      <div class="sk-main">
        <SKanbanTopBar
          :title="title"
          :show-search="store.activeView === 'kanban'"
          :show-new-button="store.activeView === 'kanban'"
          @search="onSearch"
          @new-conversation="openNewConversation"
        />

        <SKanbanFilterBar
          :visible="showFilters"
          @filter-change="onFilterChange"
        />

        <!-- Views -->
        <KanbanBoard v-if="store.activeView === 'kanban'" />

        <SKanbanDashboard v-else-if="store.activeView === 'dashboard'" />

        <div v-else class="sk-empty" style="flex:1">
          <p>Conversas — Em breve (Fase 3)</p>
        </div>
      </div>
    </div>

    <!-- Drawer -->
    <SKanbanDrawer
      :conversation="store.drawerConversation"
      :open="store.isDrawerOpen"
      @close="onCloseDrawer"
    />

    <!-- Create Conversation Modal -->
    <CreateConversation ref="createConversationRef" />
  </div>
</template>
