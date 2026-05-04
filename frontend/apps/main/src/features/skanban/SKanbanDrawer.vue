<script setup>
import {
  contactFullName,
  channelClass,
  channelLabel,
  priorityClass,
  priorityLabel,
  slaPercent,
  slaStatusClass,
  formatDateTime,
  getInitials,
  avatarColor
} from './skanbanUtils'
import { useRouter } from 'vue-router'
import { 
  Mail, 
  Tag, 
  Clock, 
  User, 
  Hash, 
  Inbox, 
  ChevronRight,
  Calendar,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Moon,
  Users
} from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { useConversationStore } from '@/stores/conversation'
import { useUsersStore } from '@/stores/users'
import { useTeamStore } from '@/stores/team'
import { useTagStore } from '@/stores/tag'
import { useI18n } from 'vue-i18n'
import SelectComboBox from '@main/components/combobox/SelectCombobox.vue'
import { SelectTag } from '@shared-ui/components/ui/select'
import { CONVERSATION_DEFAULT_STATUSES } from '@/constants/conversation'
import { EMITTER_EVENTS } from '@/constants/emitterEvents.js'
import { useEmitter } from '@/composables/useEmitter'
import './skanbanDrawer.css'

const props = defineProps({
  conversation: { type: Object, default: null },
  open: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])
const router = useRouter()
const { t } = useI18n()
const emitter = useEmitter()

const conversationStore = useConversationStore()
const usersStore = useUsersStore()
const teamsStore = useTeamStore()
const tagStore = useTagStore()

const name = computed(() => contactFullName(props.conversation?.contact))
const initials = computed(() => getInitials(name.value))
const avatarBg = computed(() => avatarColor(name.value))

const tags = ref([])
const priorityOptions = computed(() => conversationStore.priorityOptions)

onMounted(async () => {
  await tagStore.fetchTags()
  tags.value = tagStore.tags.map((item) => item.name)
})

function goToConversation() {
  if (props.conversation?.uuid) {
    router.push({
      name: 'inbox-conversation',
      params: {
        type: 'all',
        uuid: props.conversation.uuid
      }
    })
  }
}

const handleUpdateStatus = (status) => {
  if (status === CONVERSATION_DEFAULT_STATUSES.SNOOZED) {
    emitter.emit(EMITTER_EVENTS.SET_NESTED_COMMAND, {
      command: 'snooze',
      open: true
    })
    return
  }
  conversationStore.updateStatus(status)
}

const selectAgent = (agent) => {
  if (agent.value === 'none') {
    conversationStore.removeAssignee('user')
    return
  }
  conversationStore.updateAssignee('user', { assignee_id: parseInt(agent.value) })
}

const selectTeam = (team) => {
  if (team.value === 'none') {
    conversationStore.removeAssignee('team')
    return
  }
  conversationStore.updateAssignee('team', { assignee_id: parseInt(team.value) })
}

const selectPriority = (priority) => {
  conversationStore.updatePriority(priority.label)
}

watch(
  () => conversationStore.current?.tags,
  (newTags, oldTags) => {
    if (!newTags) return
    if (JSON.stringify(newTags) === JSON.stringify(oldTags)) return
    conversationStore.upsertTags({ tags: newTags })
  },
  { deep: true }
)
</script>

<template>
  <div class="sk-drawer-overlay" :class="{ open: open }" @click="emit('close')" />
  <div class="sk-drawer" :class="{ open: open }">
    <div v-if="conversation" class="sk-drawer-header">
      <div class="sk-header-main">
        <div class="sk-header-avatar" :style="{ backgroundColor: avatarBg }">{{ initials }}</div>
        <div class="sk-header-title">
          <div class="protocol">Protocolo: #{{ conversation.uuid.slice(0, 8) }}</div>
          <h2>{{ name }}</h2>
          <div class="sk-header-subtitle">
            <span class="channel-label-mini" :class="channelClass(conversation.inbox_channel)">
              {{ channelLabel(conversation.inbox_channel) }}
            </span>
            <span class="dot-sep">·</span>
            <span>Atendimento via {{ channelLabel(conversation.inbox_channel) }}</span>
          </div>
        </div>
      </div>

      <div class="sk-header-meta-grid">
        <div class="sk-detail-card mini">
          <div class="sk-detail-icon"><Tag size="14" /></div>
          <div class="sk-detail-info">
            <label>Prioridade</label>
            <div class="value">
              <span class="sk-priority-dot" :class="priorityClass(conversation.priority)" />
              {{ priorityLabel(conversation.priority) }}
            </div>
          </div>
        </div>

        <div class="sk-detail-card mini">
          <div class="sk-detail-icon"><Clock size="14" /></div>
          <div class="sk-detail-info">
            <label>SLA Restante</label>
            <div class="value" :class="slaStatusClass(conversation.next_sla_deadline_at)">
              {{ Math.round(slaPercent(conversation.next_sla_deadline_at)) }}%
            </div>
          </div>
        </div>

        <div class="sk-detail-card mini">
          <div class="sk-detail-icon"><Calendar size="14" /></div>
          <div class="sk-detail-info">
            <label>Criado em</label>
            <div class="value">{{ formatDateTime(conversation.created_at) }}</div>
          </div>
        </div>

        <button class="sk-btn-pill-action" @click="goToConversation">
          Ir para conversa
          <ArrowRight size="14" />
        </button>
      </div>
    </div>

    <div class="sk-drawer-body" v-if="conversation">
      <div class="sk-details-content">
        <h3 class="sk-details-title">Informações Gerais</h3>
        
        <div class="sk-details-grid">
          <div class="sk-detail-card">
            <div class="sk-detail-icon"><User size="16" /></div>
            <div class="sk-detail-info">
              <label>Cliente</label>
              <div class="value">{{ contactFullName(conversation.contact) }}</div>
            </div>
          </div>

          <div class="sk-detail-card">
            <div class="sk-detail-icon"><Mail size="16" /></div>
            <div class="sk-detail-info">
              <label>Email</label>
              <div class="value">{{ conversation?.contact?.email || '—' }}</div>
            </div>
          </div>

          <div class="sk-detail-card">
            <div class="sk-detail-icon"><Hash size="16" /></div>
            <div class="sk-detail-info">
              <label>ID da Conversa</label>
              <div class="value">{{ conversation?.id }}</div>
            </div>
          </div>

          <div class="sk-detail-card">
            <div class="sk-detail-icon"><Inbox size="16" /></div>
            <div class="sk-detail-info">
              <label>Caixa de Entrada</label>
              <div class="value">
                <span class="channel-label-mini" :class="channelClass(conversation.inbox_channel)">
                  {{ channelLabel(conversation.inbox_channel) }}
                </span>
              </div>
            </div>
          </div>

          <div class="sk-detail-card wide">
            <div class="sk-detail-icon"><MessageSquare size="16" /></div>
            <div class="sk-detail-info">
              <label>Assunto</label>
              <div class="value">{{ conversation?.subject || 'Sem assunto' }}</div>
            </div>
          </div>

          <div class="sk-detail-card">
            <div class="sk-detail-icon"><Tag size="16" /></div>
            <div class="sk-detail-info">
              <label>Status</label>
              <div class="value">
                <span class="sk-status-pill">{{ conversation?.status }}</span>
              </div>
            </div>
          </div>

          <div class="sk-detail-card">
            <div class="sk-detail-icon"><Clock size="16" /></div>
            <div class="sk-detail-info">
              <label>Última Atividade</label>
              <div class="value">{{ formatDateTime(conversation.last_message_at) }}</div>
            </div>
          </div>
        </div>

        <h3 class="sk-details-title" style="margin-top: 2rem">Atribuição</h3>
        <div class="sk-details-grid">
           <div class="sk-detail-card">
            <div class="sk-detail-icon"><User size="16" /></div>
            <div class="sk-detail-info">
              <label>Agente Atribuído</label>
              <div class="value">{{ conversation?.assigned_agent?.first_name ? conversation.assigned_agent.first_name + ' ' + (conversation.assigned_agent.last_name || '') : 'Não atribuído' }}</div>
            </div>
          </div>
          <div class="sk-detail-card">
            <div class="sk-detail-icon"><Inbox size="16" /></div>
            <div class="sk-detail-info">
              <label>Time</label>
              <div class="value">{{ conversation?.assigned_team?.name || 'Não atribuído' }}</div>
            </div>
          </div>
        </div>

        <h3 class="sk-details-title" style="margin-top: 2.5rem">Ações de Atendimento</h3>
        
        <div class="sk-actions-status">
          <button 
            v-if="conversation?.status !== 'Closed'" 
            class="sk-action-btn resolve" 
            @click="handleUpdateStatus('Closed')"
          >
            <CheckCircle size="18" />
            Resolver Conversa
          </button>
          <button 
            v-else 
            class="sk-action-btn reopen" 
            @click="handleUpdateStatus('Open')"
          >
            <ArrowRight size="18" />
            Reabrir Conversa
          </button>
          <button class="sk-action-btn snooze" @click="handleUpdateStatus('Snoozed')">
            <Moon size="18" />
            Adiar (Snooze)
          </button>
        </div>

        <div class="sk-actions-grid" v-if="conversationStore.current">
          <div class="sk-action-card">
            <div class="sk-action-icon"><User size="16" /></div>
            <div class="sk-action-info">
              <label>Alterar Agente</label>
              <SelectComboBox
                v-model="conversationStore.current.assigned_user_id"
                :items="[{ value: 'none', label: t('globals.terms.none') }, ...usersStore.options]"
                :placeholder="t('placeholders.selectAgent')"
                @select="selectAgent"
                type="user"
              />
            </div>
          </div>

          <div class="sk-action-card">
            <div class="sk-action-icon"><Users size="16" /></div>
            <div class="sk-action-info">
              <label>Alterar Time</label>
              <SelectComboBox
                v-model="conversationStore.current.assigned_team_id"
                :items="[{ value: 'none', label: t('globals.terms.none') }, ...teamsStore.options]"
                :placeholder="t('placeholders.selectTeam')"
                @select="selectTeam"
                type="team"
              />
            </div>
          </div>

          <div class="sk-action-card">
            <div class="sk-action-icon"><Tag size="16" /></div>
            <div class="sk-action-info">
              <label>Alterar Prioridade</label>
              <SelectComboBox
                v-model="conversationStore.current.priority_id"
                :items="priorityOptions"
                :placeholder="t('placeholders.selectPriority')"
                @select="selectPriority"
                type="priority"
              />
            </div>
          </div>

          <div class="sk-action-card">
            <div class="sk-action-icon"><Tag size="16" /></div>
            <div class="sk-action-info">
              <label>Gerenciar Tags</label>
              <SelectTag
                v-model="conversationStore.current.tags"
                :items="tags.map((tag) => ({ label: tag, value: tag }))"
                :placeholder="t('placeholders.selectTags')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sk-header-main {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.sk-header-avatar {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.sk-header-title .protocol {
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.sk-header-title h2 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}

.sk-header-subtitle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin-top: 0.25rem;
}

.sk-btn-pill-action {
  grid-column: span 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--skr-blue);
  color: white;
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.2);
  min-height: 3.5rem; /* Match the height of detail cards */
}
.sk-btn-pill-action:hover {
  background: var(--skr-blue-hover);
  transform: translateY(-0.125rem);
  box-shadow: 0 6px 16px rgba(0, 113, 227, 0.3);
}

.sk-header-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.sk-details-title {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.25rem;
}

.sk-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.sk-detail-card {
  background: hsl(var(--card));
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  transition: 0.2s;
}
.sk-detail-card:hover {
  border-color: var(--skr-blue-20);
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}
.sk-detail-card.mini {
  padding: 0.75rem;
  gap: 0.5rem;
}
.sk-detail-card.wide {
  grid-column: span 2;
}

.sk-detail-icon {
  width: 2rem;
  height: 2rem;
  background: hsl(var(--muted));
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--skr-blue);
  flex-shrink: 0;
}
.sk-detail-card.mini .sk-detail-icon {
  width: 1.75rem;
  height: 1.75rem;
}

.sk-detail-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.sk-detail-info label {
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.sk-detail-info .value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  word-break: break-all;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.sk-status-pill {
  background: var(--skr-blue-10);
  color: var(--skr-blue);
  padding: 0.125rem 0.625rem;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 800;
}

.channel-label-mini {
  font-size: 0.75rem;
  font-weight: 700;
}
.sk-actions-status {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.sk-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 800;
  border: 1px solid var(--border-subtle);
  background: hsl(var(--card));
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sk-action-btn:hover {
  background: hsl(var(--card));
  transform: translateY(-0.125rem);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}

.sk-action-btn.resolve {
  background: #f2fbf4;
  color: #34c759;
  border-color: rgba(52, 199, 89, 0.2);
}
.sk-action-btn.resolve:hover {
  background: #e6f7eb;
  border-color: #34c759;
}

.sk-action-btn.reopen {
  background: #f2f8fe;
  color: var(--skr-blue);
  border-color: rgba(0, 113, 227, 0.2);
}
.sk-action-btn.reopen:hover {
  background: #e6f1fc;
  border-color: var(--skr-blue);
}

.sk-action-btn.snooze {
  background: #fff9f2;
  color: #ff9f0a;
  border-color: rgba(255, 159, 10, 0.2);
}
.sk-action-btn.snooze:hover {
  background: #fff2e6;
  border-color: #ff9f0a;
}

.sk-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.sk-action-card {
  background: hsl(var(--card));
  padding: 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.sk-action-card:focus-within {
  border-color: var(--skr-blue);
  box-shadow: 0 0 0 3px var(--skr-blue-10);
}

.sk-action-icon {
  width: 2.25rem;
  height: 2.25rem;
  background: hsl(var(--muted));
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--skr-blue);
  flex-shrink: 0;
}

.sk-action-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.sk-action-info label {
  font-size: 0.6875rem;
  font-weight: 800;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Ensure SelectComboBox and SelectTag look consistent */
:deep(.select-trigger) {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  height: 2.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.8125rem;
}
:deep(.select-trigger:hover) {
  background-color: hsl(var(--muted));
}
</style>
