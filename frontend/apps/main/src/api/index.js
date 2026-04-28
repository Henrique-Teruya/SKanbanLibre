import axios from 'axios'
import qs from 'qs'

const http = axios.create({
  timeout: 10000,
  responseType: 'json'
})

function getCSRFToken () {
  const name = 'csrf_token='
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim()
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

// Request interceptor.
http.interceptors.request.use((request) => {
  const token = getCSRFToken()
  if (token) {
    request.headers['X-CSRFTOKEN'] = token
  }

  // Set content type for POST/PUT requests if the content type is not set.
  if ((request.method === 'post' || request.method === 'put') && !request.headers['Content-Type']) {
    request.headers['Content-Type'] = 'application/json'
  }
  
  if (request.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    request.data = qs.stringify(request.data)
  }
  
  return request
})

const getCustomAttributes = (appliesTo) =>
  http.get('/api/v1/custom-attributes', {
    params: { applies_to: appliesTo }
  })
const createCustomAttribute = (data) =>
  http.post('/api/v1/custom-attributes', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const getCustomAttribute = (id) => http.get(`/api/v1/custom-attributes/${id}`)
const updateCustomAttribute = (id, data) =>
  http.put(`/api/v1/custom-attributes/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const deleteCustomAttribute = (id) => http.delete(`/api/v1/custom-attributes/${id}`)
const searchConversations = (params) => http.get('/api/v1/conversations/search', { params })
const searchMessages = (params) => http.get('/api/v1/messages/search', { params })
const searchContacts = (params) => http.get('/api/v1/contacts/search', { params })
const getEmailNotificationSettings = () => http.get('/api/v1/settings/notifications/email')
const updateEmailNotificationSettings = (data) =>
  http.put('/api/v1/settings/notifications/email', data)
const getPriorities = () => http.get('/api/v1/priorities')
const getStatuses = () => http.get('/api/v1/statuses')
const createStatus = (data) => http.post('/api/v1/statuses', data)
const updateStatus = (id, data) => http.put(`/api/v1/statuses/${id}`, data)
const deleteStatus = (id) => http.delete(`/api/v1/statuses/${id}`)
const createTag = (data) => http.post('/api/v1/tags', data)
const updateTag = (id, data) => http.put(`/api/v1/tags/${id}`, data)
const deleteTag = (id) => http.delete(`/api/v1/tags/${id}`)
const getTemplate = (id) => http.get(`/api/v1/templates/${id}`)
const getTemplates = (type) => http.get('/api/v1/templates', { params: { type: type } })
const createTemplate = (data) =>
  http.post('/api/v1/templates', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const deleteTemplate = (id) => http.delete(`/api/v1/templates/${id}`)
const updateTemplate = (id, data) =>
  http.put(`/api/v1/templates/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

const getAllBusinessHours = () => http.get('/api/v1/business-hours')
const getBusinessHours = (id) => http.get(`/api/v1/business-hours/${id}`)
const createBusinessHours = (data) =>
  http.post('/api/v1/business-hours', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const updateBusinessHours = (id, data) =>
  http.put(`/api/v1/business-hours/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const deleteBusinessHours = (id) => http.delete(`/api/v1/business-hours/${id}`)

const getAllSLAs = () => http.get('/api/v1/sla')
const getSLA = (id) => http.get(`/api/v1/sla/${id}`)
const createSLA = (data) =>
  http.post('/api/v1/sla', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const updateSLA = (id, data) =>
  http.put(`/api/v1/sla/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const deleteSLA = (id) => http.delete(`/api/v1/sla/${id}`)
const createOIDC = (data) =>
  http.post('/api/v1/oidc', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const getConfig = () => http.get('/api/v1/config')
const getAllOIDC = () => http.get('/api/v1/oidc')
const getOIDC = (id) => http.get(`/api/v1/oidc/${id}`)
const updateOIDC = (id, data) =>
  http.put(`/api/v1/oidc/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const deleteOIDC = (id) => http.delete(`/api/v1/oidc/${id}`)
const updateSettings = (key, data) =>
  http.put(`/api/v1/settings/${key}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const getSettings = (key) => http.get(`/api/v1/settings/${key}`)
const login = (data) => http.post(`/api/v1/auth/login`, data, {
  headers: {
    'Content-Type': 'application/json'
  }
})
const getAutomationRules = (type) =>
  http.get(`/api/v1/automations/rules`, {
    params: { type: type }
  })
const toggleAutomationRule = (id) => http.put(`/api/v1/automations/rules/${id}/toggle`)
const getAutomationRule = (id) => http.get(`/api/v1/automations/rules/${id}`)
const updateAutomationRule = (id, data) =>
  http.put(`/api/v1/automations/rules/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const createAutomationRule = (data) =>
  http.post(`/api/v1/automations/rules`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const deleteAutomationRule = (id) => http.delete(`/api/v1/automations/rules/${id}`)
const updateAutomationRuleWeights = (data) =>
  http.put(`/api/v1/automations/rules/weights`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const updateAutomationRulesExecutionMode = (data) =>
  http.put(`/api/v1/automations/rules/execution-mode`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const getRoles = () => http.get('/api/v1/roles')
const getRole = (id) => http.get(`/api/v1/roles/${id}`)
const createRole = (data) =>
  http.post('/api/v1/roles', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const updateRole = (id, data) =>
  http.put(`/api/v1/roles/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const deleteRole = (id) => http.delete(`/api/v1/roles/${id}`)
const getContacts = (params) => http.get('/api/v1/contacts', { params })
const getContact = (id) => http.get(`/api/v1/contacts/${id}`)
const updateContact = (id, data) =>
  http.put(`/api/v1/contacts/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
const blockContact = (id, data) => http.put(`/api/v1/contacts/${id}/block`, data, {
  headers: {
    'Content-Type': 'application/json'
  }
})
const getTeam = (id) => http.get(`/api/v1/teams/${id}`)
const getTeams = () => http.get('/api/v1/teams')
const updateTeam = (id, data) => http.put(`/api/v1/teams/${id}`, data, {
  headers: {
    'Content-Type': 'application/json'
  }
})
const createTeam = (data) => http.post('/api/v1/teams', data, {
  headers: {
    'Content-Type': 'application/json'
  }
})
const getTeamsCompact = () => http.get('/api/v1/teams/compact')
const deleteTeam = (id) => http.delete(`/api/v1/teams/${id}`)
const updateUser = (id, data) =>
  http.put(`/api/v1/agents/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const getUsers = () => http.get('/api/v1/agents')
const getUsersCompact = () => http.get('/api/v1/agents/compact')
const updateCurrentUser = (data) =>
  http.put('/api/v1/agents/me', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
const getUser = (id) => http.get(`/api/v1/agents/${id}`)
const deleteUserAvatar = () => http.delete('/api/v1/agents/me/avatar')
const getCurrentUser = () => http.get('/api/v1/agents/me')
const getCurrentUserTeams = () => http.get('/api/v1/agents/me/teams')
const updateCurrentUserAvailability = (data) => http.put('/api/v1/agents/me/availability', data, {
  headers: {
    'Content-Type': 'application/json'
  }
})
const resetPassword = (data) => http.post('/api/v1/agents/reset-password', data, {
  headers: {
    'Content-Type': 'application/json'
  }
})
const setPassword = (data) => http.post('/api/v1/agents/set-password', data, {
  headers: {
    'Content-Type': 'application/json'
  }
})
const deleteUser = (id) => http.delete(`/api/v1/agents/${id}`)
const importAgents = (data) =>
  http.post('/api/v1/agents/import', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
const getAgentImportStatus = () => http.get('/api/v1/agents/import/status')
const createUser = (data) =>
  http.post('/api/v1/agents', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const getTags = () => http.get('/api/v1/tags')
const importTags = (data) =>
  http.post('/api/v1/tags/import', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
const getTagImportStatus = () => http.get('/api/v1/tags/import/status')
const upsertTags = (uuid, data) => http.post(`/api/v1/conversations/${uuid}/tags`, data, {
  headers: {
    'Content-Type': 'application/json'
  }
})
const updateAssignee = (uuid, assignee_type, data) =>
  http.put(`/api/v1/conversations/${uuid}/assignee/${assignee_type}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const removeAssignee = (uuid, assignee_type) =>
  http.put(`/api/v1/conversations/${uuid}/assignee/${assignee_type}/remove`)
const updateContactCustomAttribute = (uuid, data) =>
  http.put(`/api/v1/conversations/${uuid}/contacts/custom-attributes`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const updateConversationCustomAttribute = (uuid, data) =>
  http.put(`/api/v1/conversations/${uuid}/custom-attributes`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const createConversation = (data) =>
  http.post('/api/v1/conversations', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const updateConversationStatus = (uuid, data) =>
  http.put(`/api/v1/conversations/${uuid}/status`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const updateConversationPriority = (uuid, data) =>
  http.put(`/api/v1/conversations/${uuid}/priority`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const updateAssigneeLastSeen = (uuid) => http.put(`/api/v1/conversations/${uuid}/last-seen`)
const markConversationAsUnread = (uuid) => http.put(`/api/v1/conversations/${uuid}/mark-unread`)
const getConversationMessage = (cuuid, uuid) =>
  http.get(`/api/v1/conversations/${cuuid}/messages/${uuid}`)
const retryMessage = (cuuid, uuid) =>
  http.put(`/api/v1/conversations/${cuuid}/messages/${uuid}/retry`)
const getConversationMessages = (uuid, params) =>
  http.get(`/api/v1/conversations/${uuid}/messages`, { params })
const sendMessage = (uuid, data) =>
  http.post(`/api/v1/conversations/${uuid}/messages`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const getConversation = (uuid) => http.get(`/api/v1/conversations/${uuid}`)
const getConversationParticipants = (uuid) => http.get(`/api/v1/conversations/${uuid}/participants`)
const getContactPageVisits = (uuid) => http.get(`/api/v1/conversations/${uuid}/page-visits`)

const getCustomizations = () => http.get('/api/v1/customizations')
const getCustomization = (id) => http.get(`/api/v1/customizations/${id}`)
const createCustomization = (data) =>
  http.post('/api/v1/customizations', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const updateCustomization = (id, data) =>
  http.put(`/api/v1/customizations/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
const deleteCustomization = (id) => http.delete(`/api/v1/customizations/${id}`)
const toggleCustomization = (id) => http.put(`/api/v1/customizations/${id}/toggle`)

export default {
  login,
  deleteUser,
  importAgents,
  getAgentImportStatus,
  importTags,
  getTagImportStatus,
  resetPassword,
  setPassword,
  getTags,
  getTeam,
  getUser,
  getRoles,
  getRole,
  createRole,
  deleteRole,
  updateRole,
  getTeams,
  deleteTeam,
  getUsers,
  getInbox,
  getInboxes,
  getLanguage,
  getAvailableLanguages,
  getConversation,
  getAutomationRule,
  getAutomationRules,
  getAllBusinessHours,
  getBusinessHours,
  createBusinessHours,
  updateBusinessHours,
  deleteBusinessHours,
  getAllSLAs,
  getSLA,
  createSLA,
  updateSLA,
  deleteSLA,
  getAssignedConversations,
  getUnassignedConversations,
  getAllConversations,
  getMentionedConversations,
  getTeamUnassignedConversations,
  getViewConversations,
  getOverviewCharts,
  getOverviewCounts,
  getOverviewSLA,
  getOverviewCSAT,
  getOverviewMessageVolume,
  getOverviewTagDistribution,
  getConversationParticipants,
  getConversationMessage,
  getConversationMessages,
  getCurrentUser,
  getCurrentUserTeams,
  getAllMacros,
  getMacro,
  createMacro,
  updateMacro,
  deleteMacro,
  applyMacro,
  updateCurrentUser,
  updateAssignee,
  updateConversationStatus,
  updateConversationPriority,
  upsertTags,
  updateConversationCustomAttribute,
  updateContactCustomAttribute,
  uploadMedia,
  updateAssigneeLastSeen,
  markConversationAsUnread,
  updateUser,
  updateCurrentUserAvailability,
  updateAutomationRule,
  updateAutomationRuleWeights,
  updateAutomationRulesExecutionMode,
  updateAIProvider,
  createAutomationRule,
  toggleAutomationRule,
  deleteAutomationRule,
  createConversation,
  sendMessage,
  retryMessage,
  createUser,
  createInbox,
  updateInbox,
  deleteInbox,
  toggleInbox,
  createTeam,
  updateTeam,
  getSettings,
  updateSettings,
  createOIDC,
  getAllOIDC,
  getConfig,
  getOIDC,
  updateOIDC,
  deleteOIDC,
  getTemplate,
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  deleteUserAvatar,
  createTag,
  updateTag,
  deleteTag,
  getStatuses,
  getPriorities,
  createStatus,
  updateStatus,
  deleteStatus,
  getTeamsCompact,
  getUsersCompact,
  getEmailNotificationSettings,
  updateEmailNotificationSettings,
  saveDraft,
  getAllDrafts,
  deleteDraft,
  getCurrentUserViews,
  createView,
  updateView,
  deleteView,
  getSharedViews,
  getAllSharedViews,
  getSharedView,
  createSharedView,
  updateSharedView,
  deleteSharedView,
  getAiPrompts,
  aiCompletion,
  searchConversations,
  searchMessages,
  searchContacts,
  removeAssignee,
  getContacts,
  getContact,
  updateContact,
  blockContact,
  getCustomAttributes,
  createCustomAttribute,
  updateCustomAttribute,
  deleteCustomAttribute,
  getCustomAttribute,
  getContactNotes,
  createContactNote,
  deleteContactNote,
  getActivityLogs,
  getWebhooks,
  getWebhook,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  toggleWebhook,
  testWebhook,
  getContextLinks,
  getContextLink,
  createContextLink,
  updateContextLink,
  deleteContextLink,
  toggleContextLink,
  getActiveContextLinks,
  getContextLinkURL,
  generateAPIKey,
  revokeAPIKey,
  initiateOAuthFlow,
  getNotifications,
  getNotificationStats,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  getContactPageVisits,
  getCustomizations,
  getCustomization,
  createCustomization,
  updateCustomization,
  deleteCustomization,
  toggleCustomization
}
