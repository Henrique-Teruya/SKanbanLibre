import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'
import { handleHTTPError } from '@shared-ui/utils/http.js'
import { useEmitter } from '../composables/useEmitter'
import { EMITTER_EVENTS } from '../constants/emitterEvents'

export const useSKanbanStore = defineStore('skanban', () => {
  const emitterInstance = ref(null)

  // ── State ──
  const activeView = ref('kanban')
  const filters = ref({})
  const conversations = ref([])
  const statuses = ref([])
  const loading = ref(false)
  const drawerConversation = ref(null)
  const isDrawerOpen = ref(false)
  const searchQuery = ref('')
  const dashboardStats = ref({
    counts: {},
    sla: {},
    charts: { new_conversations: [], resolved_conversations: [] }
  })

  // ── Getters ──
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
      result = result.filter((c) => c.priority === filters.value.priority)
    }
    if (filters.value.channel) {
      result = result.filter((c) => c.inbox_channel === filters.value.channel)
    }
    if (filters.value.agent) {
      result = result.filter((c) => c.assigned_agent_id === parseInt(filters.value.agent))
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

  const filteredGroupedByStatus = computed(() => {
    const grouped = {}
    for (const status of statuses.value) {
      grouped[status.id] = {
        status,
        conversations: filteredConversations.value.filter((c) => c.status === status.name)
      }
    }
    return grouped
  })

  // ── Actions ──
  function setActiveView(view) {
    activeView.value = view
  }

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
    drawerConversation.value = conversation
    isDrawerOpen.value = true
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

  async function moveCard(uuid, newStatusName) {
    const conv = conversations.value.find((c) => c.uuid === uuid)
    if (!conv || conv.status === newStatusName) return

    const oldStatus = conv.status
    // Optimistic update
    conv.status = newStatusName

    try {
      await api.updateConversationStatus(uuid, { status: newStatusName })
    } catch (error) {
      // Rollback
      conv.status = oldStatus
      emitterInstance.value?.emit(EMITTER_EVENTS.SHOW_TOAST, {
        variant: 'destructive',
        description: handleHTTPError(error).message
      })
    }
  }

  async function fetchDashboardStats() {
    try {
      const [counts, sla, charts] = await Promise.all([
        api.getOverviewCounts(),
        api.getOverviewSLA({ days: 30 }),
        api.getOverviewCharts({ days: 30 })
      ])
      dashboardStats.value = {
        counts: counts.data.data,
        sla: sla.data.data,
        charts: charts.data.data
      }
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
    activeView,
    filters,
    conversations,
    statuses,
    loading,
    drawerConversation,
    isDrawerOpen,
    searchQuery,
    dashboardStats,
    groupedByStatus,
    openCount,
    filteredConversations,
    filteredGroupedByStatus,
    setActiveView,
    setFilter,
    clearFilters,
    setSearchQuery,
    openDrawer,
    closeDrawer,
    fetchStatuses,
    fetchConversations,
    fetchDashboardStats,
    moveCard,
    init
  }
})
