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
  slaStatusClass
} from './skanbanUtils'

const props = defineProps({
  conversation: { type: Object, required: true }
})

const emit = defineEmits(['open-drawer'])

const name = computed(() => contactFullName(props.conversation.contact))
const chClass = computed(() => channelClass(props.conversation.inbox_channel))
const chIcon = computed(() => channelIcon(props.conversation.inbox_channel))
const chLabel = computed(() => channelLabel(props.conversation.inbox_channel))
const priClass = computed(() => priorityClass(props.conversation.priority))
const time = computed(() => timeAgo(props.conversation.last_message_at))
const slaPct = computed(() => slaPercent(props.conversation.next_sla_deadline_at))
const slaClass = computed(() => slaStatusClass(props.conversation.next_sla_deadline_at))
const subtitle = computed(() => props.conversation.subject || props.conversation.last_message || '')

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
      <span class="sk-priority-dot" :class="priClass" :title="conversation.priority" />
      <div class="sk-card-title">{{ name }}</div>
      <span class="sk-channel-icon" :title="chLabel" v-html="chIcon" />
    </div>
    <div class="sk-card-subtitle">{{ subtitle }}</div>
    <div class="sk-card-meta">
      <span class="sk-card-time">{{ time }}</span>
    </div>
    <div :class="slaClass">
      <div class="sk-sla-bar">
        <div class="sk-sla-bar-fill" :style="{ width: slaPct + '%' }" />
      </div>
    </div>
  </div>
</template>
