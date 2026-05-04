import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'
import { handleHTTPError } from '@shared-ui/utils/http.js'
import { useEmitter } from '../composables/useEmitter'
import { EMITTER_EVENTS } from '../constants/emitterEvents'
import { useConversationStore } from './conversation'

export const useSKanbanStore = defineStore('skanban', () => {
  const emitterInstance = ref(null)

  // ── State ──
  const filters = ref({})
  const conversations = ref([])
  const statuses = ref([])
  const loading = ref(false)
  const drawerConversation = ref(null)
  const isDrawerOpen = ref(false)
  const searchQuery = ref('')

  // ── Getters ──
  const boardColumns = computed(() => {
    const colDefinitions = [
      { id: 'novo', name: 'Novo Atendimento', color: '#0071e3' },
      { id: 'em-atendimento', name: 'Em atendimento', color: '#34c759' },
      { id: 'aguardando-interno', name: 'Aguardando retorno interno', color: '#ff9f0a' },
      { id: 'retorno-disponivel', name: 'Retorno interno disponível', color: '#af52de' },
      { id: 'finalizado', name: 'Finalizado', color: '#8e8e93' }
    ]

    const grouped = {}
    colDefinitions.forEach(col => {
      grouped[col.id] = { status: col, conversations: [] }
    })

    filteredConversations.value.forEach(c => {
      const isClosed = ['Closed', 'Resolved'].includes(c.status)
      const isAssigned = !!c.assigned_agent_id
      const tags = c.tags || []
      
      if (isClosed) {
        grouped['finalizado'].conversations.push(c)
      } else if (tags.some(t => t.name.toLowerCase() === 'aguardando retorno')) {
        grouped['aguardando-interno'].conversations.push(c)
      } else if (tags.some(t => t.name.toLowerCase() === 'retorno disponível')) {
        grouped['retorno-disponivel'].conversations.push(c)
      } else if (isAssigned) {
        grouped['em-atendimento'].conversations.push(c)
      } else {
        grouped['novo'].conversations.push(c)
      }
    })

    return colDefinitions.map(def => grouped[def.id])
  })

  // Keep compatibility with other features if needed, but board should use boardColumns
  const groupedByStatus = computed(() => {
    const grouped = {}
    for (const status of statuses.value) {
      grouped[status.id] = {
        status,
        conversations: conversations.value.filter((c) => c.status === status.name)
      }
    }
    return grouped
  })

  const openCount = computed(() => {
    return conversations.value.filter((c) => c.status !== 'Closed').length
  })

  const filteredConversations = computed(() => {
    let result = [...conversations.value]
    if (filters.value.priority) {
      result = result.filter((c) => {
        const pId = c.priority_id || c.priority?.id || c.priority
        return pId?.toString() === filters.value.priority.toString()
      })
    }
    if (filters.value.channel) {
      result = result.filter((c) => c.inbox_channel === filters.value.channel)
    }
    if (filters.value.agent) {
      result = result.filter((c) => c.assigned_agent_id === parseInt(filters.value.agent))
    }
    if (filters.value.team) {
      result = result.filter((c) => c.assigned_team_id === parseInt(filters.value.team))
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter((c) => {
        const name = `${c.contact?.first_name || ''} ${c.contact?.last_name || ''}`.toLowerCase()
        const subject = (c.subject || '').toLowerCase()
        const uuid = (c.uuid || '').toLowerCase()
        return name.includes(q) || subject.includes(q) || uuid.includes(q)
      })
    }
    return result
  })

  const filteredGroupedByStatus = boardColumns; // Alias for board compatibility

  // ── Actions ──
  function setFilter(key, value) {
    if (value) {
      filters.value = { ...filters.value, [key]: value }
    } else {
      const f = { ...filters.value }
      delete f[key]
      filters.value = f
    }
  }

  function clearFilters() {
    filters.value = {}
  }

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function openDrawer(conversation) {
    const conversationStore = useConversationStore()
    drawerConversation.value = conversation
    isDrawerOpen.value = true
    
    if (conversation?.uuid) {
      conversationStore.fetchConversation(conversation.uuid)
      conversationStore.fetchMessages(conversation.uuid)
    }
  }

  function closeDrawer() {
    isDrawerOpen.value = false
    drawerConversation.value = null
  }

  async function fetchStatuses() {
    try {
      const response = await api.getStatuses()
      statuses.value = response?.data?.data || []
    } catch (error) {
      emitterInstance.value?.emit(EMITTER_EVENTS.SHOW_TOAST, {
        variant: 'destructive',
        description: handleHTTPError(error).message
      })
    }
  }

  async function fetchConversations() {
    loading.value = true
    try {
      const response = await api.getAllConversations({
        page: 1,
        page_size: 200,
        order_by: 'conversations.last_message_at',
        order: 'desc'
      })
      const data = response?.data?.data
      conversations.value = data?.results || []
    } catch (error) {
      emitterInstance.value?.emit(EMITTER_EVENTS.SHOW_TOAST, {
        variant: 'destructive',
        description: handleHTTPError(error).message
      })
    } finally {
      loading.value = false
    }
  }

  async function moveCard(uuid, newColumnId) {
    const conv = conversations.value.find((c) => c.uuid === uuid)
    if (!conv) return

    try {
      if (newColumnId === 'finalizado') {
        await api.updateConversationStatus(uuid, { status: 'Closed' })
        conv.status = 'Closed'
      } else if (newColumnId === 'novo') {
        await api.updateConversationStatus(uuid, { status: 'Open' })
        await api.removeAssignee(uuid, 'agent')
        conv.status = 'Open'
        conv.assigned_agent_id = null
      } else if (newColumnId === 'em-atendimento') {
        await api.updateConversationStatus(uuid, { status: 'Open' })
        conv.status = 'Open'
        // If unassigned, it stays in "novo" logic unless we're forcing an assignment here. 
        // For now just ensure it's Open.
      } else if (newColumnId === 'aguardando-interno') {
        const tags = [...(conv.tags || []).map(t => t.name), 'Aguardando Retorno']
        await api.upsertTags(uuid, [...new Set(tags)])
      } else if (newColumnId === 'retorno-disponivel') {
        const tags = [...(conv.tags || []).map(t => t.name), 'Retorno Disponível']
        await api.upsertTags(uuid, [...new Set(tags)])
      }
      
      // Refresh to ensure everything is in sync
      fetchConversations()
    } catch (error) {
      emitterInstance.value?.emit(EMITTER_EVENTS.SHOW_TOAST, {
        variant: 'destructive',
        description: handleHTTPError(error).message
      })
    }
  }

  let initialized = false
  async function init(emitter) {
    if (emitter) emitterInstance.value = emitter
    
    await fetchStatuses()
    await fetchConversations()

    // Listen for real-time updates
    if (!initialized) {
      emitterInstance.value?.on(EMITTER_EVENTS.REFRESH_LIST, (data) => {
        if (data?.model === 'conversations') {
          fetchConversations()
        }
      })
      initialized = true
    }
  }

  return {
    filters,
    conversations,
    statuses,
    loading,
    drawerConversation,
    isDrawerOpen,
    searchQuery,
    groupedByStatus,
    openCount,
    filteredConversations,
    filteredGroupedByStatus,
    setFilter,
    clearFilters,
    setSearchQuery,
    openDrawer,
    closeDrawer,
    fetchStatuses,
    fetchConversations,
    moveCard,
    init
  }
})
