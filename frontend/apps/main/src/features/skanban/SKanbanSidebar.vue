<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { getInitials, avatarColor } from './skanbanUtils'

defineProps({
  activeView: { type: String, default: 'kanban' },
  kanbanCount: { type: Number, default: 0 }
})

const emit = defineEmits(['navigate'])

const userStore = useUserStore()
const userName = computed(() => `${userStore.firstName || ''} ${userStore.lastName || ''}`.trim() || 'Agente')
const userRole = computed(() => userStore.role || 'Agente')
const initials = computed(() => getInitials(userName.value))
const avatarBg = computed(() => avatarColor(userName.value))

const navItems = [
  { id: 'kanban', label: 'Kanban', icon: 'kanban' },
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'conversas', label: 'Conversas', icon: 'conversas' }
]
</script>

<template>
  <aside class="sk-sidebar">
    <div class="sk-sidebar-logo">
      <h1>S<span>Kanban</span></h1>
    </div>

    <nav class="sk-sidebar-nav">
      <div class="sk-sidebar-section">Principal</div>

      <button
        v-for="item in navItems"
        :key="item.id"
        class="sk-nav-link"
        :class="{ active: activeView === item.id }"
        @click="emit('navigate', item.id)"
      >
        <!-- Kanban icon -->
        <svg v-if="item.icon === 'kanban'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
        <!-- Dashboard icon -->
        <svg v-else-if="item.icon === 'dashboard'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
        </svg>
        <!-- Conversas icon -->
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>

        {{ item.label }}
        <span v-if="item.id === 'kanban' && kanbanCount > 0" class="sk-badge-count">
          {{ kanbanCount }}
        </span>
      </button>
    </nav>

    <div class="sk-sidebar-footer">
      <div class="sk-sidebar-user">
        <span class="sk-avatar" :style="{ background: avatarBg }">{{ initials }}</span>
        <div class="sk-sidebar-user-info">
          <div class="name">{{ userName }}</div>
          <div class="role">{{ userRole }}</div>
        </div>
      </div>
    </div>
  </aside>
</template>
