<script setup>
import { computed, watch } from 'vue'
import {
  contactFullName,
  channelClass,
  channelLabel,
  priorityClass,
  priorityLabel,
  getInitials,
  avatarColor,
  formatDateTime,
  slaPercent,
  slaStatusClass
} from './skanbanUtils'

const props = defineProps({
  conversation: { type: Object, default: null },
  open: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

const name = computed(() => contactFullName(props.conversation?.contact))
const chClass = computed(() => channelClass(props.conversation?.inbox_channel))
const chLabel = computed(() => channelLabel(props.conversation?.inbox_channel))
const priClass = computed(() => priorityClass(props.conversation?.priority))
const priLabel = computed(() => priorityLabel(props.conversation?.priority))
const slaPct = computed(() => slaPercent(props.conversation?.next_sla_deadline_at))
const slaClass = computed(() => slaStatusClass(props.conversation?.next_sla_deadline_at))
const created = computed(() => formatDateTime(props.conversation?.created_at))
const assignee = computed(() => {
  const a = props.conversation?.assigned_agent
  if (!a) return 'Não atribuído'
  return `${a.first_name || ''} ${a.last_name || ''}`.trim() || 'Agente'
})
const assigneeInitials = computed(() => getInitials(assignee.value))
const assigneeBg = computed(() => avatarColor(assignee.value))

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

watch(() => props.open, (val) => {
  if (val) {
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('keydown', onKeydown)
  }
})
</script>

<template>
  <!-- Overlay -->
  <div class="sk-drawer-overlay" :class="{ open }" @click="emit('close')" />

  <!-- Drawer -->
  <div class="sk-drawer" :class="{ open }">
    <template v-if="conversation">
      <!-- Close -->
      <button class="sk-btn-icon sk-drawer-close" @click="emit('close')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <!-- Header -->
      <div class="sk-drawer-header">
        <div class="protocol">{{ conversation.uuid?.slice(0, 8) }}</div>
        <h2>{{ conversation.subject || name }}</h2>
        <div class="crm-strip">
          <span>{{ name }}</span>
          <span style="opacity:.3">·</span>
          <span :class="chClass" style="font-weight:600">{{ chLabel }}</span>
        </div>
      </div>

      <!-- Meta grid -->
      <div class="sk-drawer-meta">
        <div class="meta-item">
          <label>Responsável</label>
          <div class="val">
            <span class="sk-avatar sk-avatar-sm" :style="{ background: assigneeBg }">{{ assigneeInitials }}</span>
            {{ assignee }}
          </div>
        </div>
        <div class="meta-item">
          <label>Prioridade</label>
          <div class="val">
            <span class="sk-priority-dot" :class="priClass" />
            {{ priLabel }}
          </div>
        </div>
        <div class="meta-item">
          <label>Status</label>
          <div class="val">{{ conversation.status }}</div>
        </div>
        <div class="meta-item">
          <label>Criado em</label>
          <div class="val">{{ created }}</div>
        </div>
      </div>

      <!-- SLA -->
      <div style="padding: var(--sk-sp-md) var(--sk-sp-lg);" :class="slaClass">
        <label style="font-size:var(--sk-fs-micro); color:var(--sk-text-3); font-weight:600; text-transform:uppercase; letter-spacing:.03em">SLA</label>
        <div class="sk-sla-bar" style="margin-top:4px">
          <div class="sk-sla-bar-fill" :style="{ width: slaPct + '%' }" />
        </div>
        <div style="display:flex; justify-content:flex-end; margin-top:4px">
          <span style="font-size:11px; color:var(--sk-text-3)">{{ Math.round(slaPct) }}%</span>
        </div>
      </div>

      <!-- Body -->
      <div class="sk-drawer-body">
        <div class="sk-detail-grid">
          <div class="sk-detail-field">
            <label>Contato</label>
            <div class="value">{{ name }}</div>
          </div>
          <div class="sk-detail-field">
            <label>Email</label>
            <div class="value">{{ conversation.contact?.email || '—' }}</div>
          </div>
          <div class="sk-detail-field">
            <label>Canal</label>
            <div class="value">{{ chLabel }}</div>
          </div>
          <div class="sk-detail-field">
            <label>Última mensagem</label>
            <div class="value" style="font-size: var(--sk-fs-micro)">
              {{ conversation.last_message || '—' }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
