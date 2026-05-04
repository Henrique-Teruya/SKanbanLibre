<script setup>
defineProps({
  title: { type: String, default: 'Kanban' },
  showSearch: { type: Boolean, default: true },
  showNewButton: { type: Boolean, default: true }
})

const emit = defineEmits(['search', 'new-conversation'])

function onInput(e) {
  emit('search', e.target.value)
}
</script>

<template>
  <header class="sk-topbar">
    <div class="sk-topbar-left">
      <h2>{{ title }}</h2>
    </div>
    <div v-if="showSearch || showNewButton" class="sk-topbar-right">
      <div v-if="showSearch" class="sk-search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder="Buscar protocolo, cliente..." @input="onInput" />
      </div>
      <button v-if="showNewButton" class="sk-btn sk-btn-primary sk-btn-sm" @click="emit('new-conversation')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Novo
      </button>
    </div>
  </header>
</template>
