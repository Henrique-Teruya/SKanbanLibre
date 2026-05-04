<script setup>
import { ref, computed } from 'vue'
import { useConversationStore } from '@/stores/conversation'
import { useInboxStore } from '@/stores/inbox'

defineProps({
  visible: { type: Boolean, default: true }
})

const emit = defineEmits(['filter-change'])
const conversationStore = useConversationStore()
const inboxStore = useInboxStore()

const activeFilters = ref({})
const openDropdown = ref(null)

const priorityOptions = computed(() => conversationStore.priorityOptions || [])
const channels = computed(() => {
  const inboxes = inboxStore.inboxes || []
  const unique = [...new Set(inboxes.map((i) => i.channel))]
  return unique.map((c) => ({ value: c, label: c }))
})

function toggleDropdown(name) {
  openDropdown.value = openDropdown.value === name ? null : name
}

function selectFilter(key, value) {
  if (value) {
    activeFilters.value = { ...activeFilters.value, [key]: value }
  } else {
    const f = { ...activeFilters.value }
    delete f[key]
    activeFilters.value = f
  }
  openDropdown.value = null
  emit('filter-change', activeFilters.value)
}

function clearAll() {
  activeFilters.value = {}
  emit('filter-change', {})
}

const hasFilters = computed(() => Object.keys(activeFilters.value).length > 0)
</script>

<template>
  <div v-if="visible" class="sk-filter-bar">
    <div class="sk-filter-group">
      <!-- Plataforma -->
      <div class="sk-dropdown" :class="{ open: openDropdown === 'channel' }">
        <button 
          class="sk-filter-btn" 
          :class="{ active: activeFilters.channel }"
          @click.stop="toggleDropdown('channel')"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>{{ activeFilters.channel || 'Plataforma' }}</span>
        </button>
        <div class="sk-dropdown-menu">
          <div class="sk-dropdown-item" @click="selectFilter('channel', '')">Todas</div>
          <div v-for="c in channels" :key="c.value" class="sk-dropdown-item" @click="selectFilter('channel', c.value)">
            {{ c.label }}
          </div>
        </div>
      </div>

      <!-- Prioridade -->
      <div class="sk-dropdown" :class="{ open: openDropdown === 'priority' }">
        <button 
          class="sk-filter-btn" 
          :class="{ active: activeFilters.priority }"
          @click.stop="toggleDropdown('priority')"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ activeFilters.priority ? priorityOptions.find(p => p.value === activeFilters.priority)?.label : 'Prioridade' }}</span>
        </button>
        <div class="sk-dropdown-menu">
          <div class="sk-dropdown-item" @click="selectFilter('priority', '')">Todas</div>
          <div v-for="p in priorityOptions" :key="p.value" class="sk-dropdown-item" @click="selectFilter('priority', p.value)">
            {{ p.label }}
          </div>
        </div>
      </div>

      <!-- Assunto -->
      <div class="sk-dropdown" :class="{ open: openDropdown === 'subject' }">
        <button 
          class="sk-filter-btn" 
          :class="{ active: activeFilters.subject }"
          @click.stop="toggleDropdown('subject')"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          <span>Assunto</span>
        </button>
        <div class="sk-dropdown-menu">
          <div class="sk-dropdown-item">Todos os Assuntos</div>
        </div>
      </div>

      <button v-if="hasFilters" class="sk-btn-clear" @click="clearAll">Limpar Filtros</button>
    </div>
  </div>
</template>

<style scoped>
.sk-filter-bar {
  padding: var(--sp-md) var(--sp-lg);
}
.sk-filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sk-filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f4f4f7;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  border: 1px solid transparent;
  transition: 0.2s;
  cursor: pointer;
}
.sk-filter-btn:hover { background: #e8e8ed; }
.sk-filter-btn.active { background: #fff; border-color: var(--skr-blue); color: var(--skr-blue); }

.sk-dropdown { position: relative; }
.sk-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 200px;
  background: #fff;
  border-radius: var(--radius-md);
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  border: 1px solid var(--border-subtle);
  padding: 8px;
  z-index: 100;
  display: none;
}
.sk-dropdown.open .sk-dropdown-menu { display: block; }
.sk-dropdown-item {
  padding: 8px 12px;
  border-radius: var(--radius-xs);
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}
.sk-dropdown-item:hover { background: #f4f4f7; }

.sk-btn-clear {
  font-size: 12px;
  font-weight: 700;
  color: #ff3b30;
  cursor: pointer;
  border: none;
  background: none;
  padding: 8px;
}
</style>
