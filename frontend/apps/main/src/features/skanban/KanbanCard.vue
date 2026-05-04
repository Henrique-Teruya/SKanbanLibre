<script setup>
import { computed } from 'vue'
import {
  contactFullName,
  channelClass,
  channelIcon,
  channelLabel,
  priorityClass,
  timeAgo,
  slaPercent,
  slaStatusClass,
  getInitials,
  avatarColor
} from './skanbanUtils'

const props = defineProps({
  conversation: { type: Object, required: true }
})

const emit = defineEmits(['open-drawer'])

const name = computed(() => contactFullName(props.conversation.contact))
const initials = computed(() => getInitials(name.value))
const avatarBg = computed(() => avatarColor(name.value))

const chClass = computed(() => channelClass(props.conversation.inbox_channel))
const chIcon = computed(() => channelIcon(props.conversation.inbox_channel))
const chLabel = computed(() => channelLabel(props.conversation.inbox_channel))
const priClass = computed(() => priorityClass(props.conversation.priority))
const time = computed(() => timeAgo(props.conversation.last_message_at))
const slaPct = computed(() => slaPercent(props.conversation.next_sla_deadline_at))
const slaClass = computed(() => slaStatusClass(props.conversation.next_sla_deadline_at))
const subtitle = computed(() => props.conversation.subject || props.conversation.last_message || 'Sem assunto')

function onDragStart(e) {
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', props.conversation.uuid)
  e.target.classList.add('dragging')
}

function onDragEnd(e) {
  e.target.classList.remove('dragging')
}
</script>

<template>
  <div
    class="sk-card"
    :class="chClass"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click="emit('open-drawer', conversation)"
  >
    <div class="sk-card-header">
      <div class="sk-card-title-group">
        <span class="sk-priority-dot" :class="priClass" :title="conversation.priority" />
        <div class="relative">
          <span class="sk-avatar-mini" :style="{ backgroundColor: avatarBg }">{{ initials }}</span>
          <span 
            v-if="conversation.unread_message_count > 0 && conversation.assigned_agent_id" 
            class="sk-reply-dot"
            title="Réplica do cliente"
          />
        </div>
        <div class="sk-card-title">{{ name }}</div>
      </div>
      <span class="sk-channel-icon" :title="chLabel" v-html="chIcon" />
    </div>
    
    <div class="sk-card-subtitle">{{ subtitle }}</div>
    
    <div class="sk-card-meta">
      <div class="sk-card-time">{{ time }}</div>
    </div>

    <div class="sk-sla-container" :class="slaClass">
      <div class="sk-sla-bar">
        <div class="sk-sla-bar-fill" :style="{ width: slaPct + '%' }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sk-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.375rem;
}
.sk-card-title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}
.sk-card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sk-channel-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  opacity: 0.8;
}
:deep(.sk-channel-icon svg) {
  width: 100%;
  height: 100%;
}
.sk-card-subtitle {
  margin-bottom: 0.75rem;
}
.sk-card-meta {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}
.sk-sla-container {
  height: 0.25rem;
  background: hsl(var(--muted));
  border-radius: 0.125rem;
  overflow: hidden;
}
.sk-sla-bar {
  height: 100%;
  width: 100%;
}
.sk-sla-bar-fill {
  height: 100%;
  background: var(--skr-blue);
  transition: width 0.3s ease;
}
.sk-sla-violated .sk-sla-bar-fill { background: #ff3b30; }
.sk-sla-warning .sk-sla-bar-fill { background: #ff9f0a; }

.sk-reply-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #0071e3;
  border: 1.5px solid hsl(var(--card));
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0, 113, 227, 0.4);
}
</style>
