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

function closeDropdowns() {
  openDropdown.value = null
}
</script>

<template>
  <div v-if="visible" class="sk-filter-bar" @click.self="closeDropdowns">
    <!-- Priority -->
    <div class="sk-dropdown" :class="{ open: openDropdown === 'priority' }">
      <button
        class="sk-filter-select"
        :class="{ active: activeFilters.priority }"
        @click.stop="toggleDropdown('priority')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>{{ activeFilters.priority ? priorityOptions.find((p) => p.value === activeFilters.priority)?.label || 'Prioridade' : 'Prioridade' }}</span>
      </button>
      <div class="sk-dropdown-menu">
        <div class="sk-dropdown-item" @click="selectFilter('priority', '', '')">Todas</div>
        <div
          v-for="p in priorityOptions"
          :key="p.value"
          class="sk-dropdown-item"
          @click="selectFilter('priority', p.value, p.label)"
        >
          {{ p.label }}
        </div>
      </div>
    </div>

    <!-- Channel -->
    <div class="sk-dropdown" :class="{ open: openDropdown === 'channel' }">
      <button
        class="sk-filter-select"
        :class="{ active: activeFilters.channel }"
        @click.stop="toggleDropdown('channel')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>{{ activeFilters.channel || 'Canal' }}</span>
      </button>
      <div class="sk-dropdown-menu">
        <div class="sk-dropdown-item" @click="selectFilter('channel', '', '')">Todos</div>
        <div
          v-for="c in channels"
          :key="c.value"
          class="sk-dropdown-item"
          @click="selectFilter('channel', c.value, c.label)"
        >
          {{ c.label }}
        </div>
      </div>
    </div>

    <button v-if="hasFilters" class="sk-btn-ghost sk-btn-sm" @click="clearAll">Limpar</button>
  </div>
</template>
