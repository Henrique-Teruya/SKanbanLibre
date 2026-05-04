/* ═══════════════════════════════════════════
   SKanban — Utility Helpers (Vue Port)
   ═══════════════════════════════════════════ */

export function timeAgo(dateStr) {
  if (!dateStr) return ''
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'agora'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}min atrás`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h atrás`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d atrás`
  return date.toLocaleDateString('pt-BR')
}

export function formatDateTime(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatTime(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const AVATAR_COLORS = [
  '#0071e3',
  '#34c759',
  '#ff9f0a',
  '#af52de',
  '#ff3b30',
  '#5856d6',
  '#00b2ff',
  '#ff6482'
]

export function avatarColor(name) {
  if (!name) return AVATAR_COLORS[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

const CHANNEL_CLASS_MAP = {
  email: 'sk-channel-email',
  livechat: 'sk-channel-portal',
  whatsapp: 'sk-channel-whatsapp',
  telegram: 'sk-channel-blip',
  api: 'sk-channel-interno'
}

export function channelClass(channel) {
  if (!channel) return 'sk-channel-interno'
  return CHANNEL_CLASS_MAP[channel.toLowerCase()] || 'sk-channel-interno'
}

const CHANNEL_ICONS = {
  email:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  livechat:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  whatsapp:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.394 0 12.03c0 2.12.553 4.189 1.602 6.04L0 24l6.117-1.605a11.803 11.803 0 005.925 1.577h.005c6.632 0 12.028-5.398 12.03-12.03a11.75 11.75 0 00-3.489-8.502z"/></svg>',
  telegram:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
  api: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
}

export function channelIcon(channel) {
  if (!channel) return CHANNEL_ICONS.api
  return CHANNEL_ICONS[channel.toLowerCase()] || CHANNEL_ICONS.api
}

export function channelLabel(channel) {
  const labels = {
    email: 'Email',
    livechat: 'Chat',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    api: 'API'
  }
  return labels[channel?.toLowerCase()] || channel || 'Interno'
}

export function priorityClass(priority) {
  if (!priority) return ''
  const name = typeof priority === 'object' ? priority.name : priority
  const map = {
    low: 'sk-priority-baixa',
    medium: 'sk-priority-media',
    high: 'sk-priority-alta',
    urgent: 'sk-priority-urgente'
  }
  return map[name?.toLowerCase()] || ''
}

export function priorityLabel(priority) {
  if (!priority) return ''
  const name = typeof priority === 'object' ? priority.name : priority
  const labels = { low: 'Baixa', medium: 'Média', high: 'Alta', urgent: 'Urgente' }
  return labels[name?.toLowerCase()] || name || ''
}

export function slaPercent(deadlineStr) {
  if (!deadlineStr) return 0
  const now = new Date()
  const deadline = new Date(deadlineStr)
  const total = deadline - now
  if (total <= 0) return 100
  // Assume 24h SLA window for visual purposes
  const window = 24 * 60 * 60 * 1000
  const elapsed = window - total
  return Math.min(Math.max((elapsed / window) * 100, 0), 100)
}

export function slaStatusClass(deadlineStr) {
  const pct = slaPercent(deadlineStr)
  if (pct >= 100) return 'sk-sla-violated'
  if (pct >= 75) return 'sk-sla-warning'
  return 'sk-sla-ok'
}

export function contactFullName(contact) {
  if (!contact) return 'Desconhecido'
  return `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'Desconhecido'
}

export function debounce(fn, ms = 300) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}
