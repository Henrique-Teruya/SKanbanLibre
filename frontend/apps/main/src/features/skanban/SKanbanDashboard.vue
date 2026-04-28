<script setup>
import { computed, onMounted } from 'vue'
import { useSKanbanStore } from '@/stores/skanban'
import { formatDuration } from '@shared-ui/utils/datetime.js'

const store = useSKanbanStore()

const stats = computed(() => store.dashboardStats)

const totalTickets = computed(() => stats.value.counts.total_conversations || 0)
const openTickets = computed(() => stats.value.counts.open || 0)
const resolvedTickets = computed(() => stats.value.counts.resolved || 0)

const avgFirstResponse = computed(() => {
  const sec = stats.value.sla.avg_first_response_time_sec || 0
  return formatDuration(sec, false)
})

const slaCompliance = computed(() => {
  return Math.round(stats.value.sla.first_response_compliance_percent || 0)
})

const chartData = computed(() => {
  const newC = stats.value.charts.new_conversations || []
  const resC = stats.value.charts.resolved_conversations || []
  
  // Combine for a simple visualization
  return newC.slice(-7).map(item => {
    const resolved = resC.find(r => r.date === item.date)?.count || 0
    return {
      date: new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'short' }),
      new: item.count,
      resolved: resolved
    }
  })
})

const maxVal = computed(() => {
  if (!chartData.value.length) return 10
  return Math.max(...chartData.value.map(d => Math.max(d.new, d.resolved))) + 2
})

onMounted(async () => {
  await store.fetchDashboardStats()
})
</script>

<template>
  <div class="sk-dashboard">
    <div class="sk-dashboard-grid">
      <!-- Stat Cards -->
      <div class="sk-stat-card sk-glass">
        <div class="sk-stat-icon" style="background: var(--sk-blue-10); color: var(--sk-blue)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div class="sk-stat-info">
          <label>Total de Tickets</label>
          <div class="value">{{ totalTickets }}</div>
          <div class="trend">Média de 30 dias</div>
        </div>
      </div>

      <div class="sk-stat-card sk-glass">
        <div class="sk-stat-icon" style="background: rgba(52, 199, 89, 0.1); color: #34c759">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div class="sk-stat-info">
          <label>Resolvidos</label>
          <div class="value">{{ resolvedTickets }}</div>
          <div class="trend">Taxa de conclusão</div>
        </div>
      </div>

      <div class="sk-stat-card sk-glass">
        <div class="sk-stat-icon" style="background: rgba(255, 159, 10, 0.1); color: #ff9f0a">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div class="sk-stat-info">
          <label>Tempo Médio (1ª Resposta)</label>
          <div class="value">{{ avgFirstResponse }}</div>
          <div class="trend">Performance do time</div>
        </div>
      </div>

      <div class="sk-stat-card sk-glass">
        <div class="sk-stat-icon" style="background: rgba(175, 82, 222, 0.1); color: #af52de">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div class="sk-stat-info">
          <label>Conformidade SLA</label>
          <div class="value">{{ slaCompliance }}%</div>
          <div class="trend">Dentro do prazo</div>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="sk-dashboard-row">
      <div class="sk-chart-container sk-glass">
        <div class="sk-chart-header">
          <h3>Volume de Atendimentos</h3>
          <p>Comparativo de tickets novos vs resolvidos nos últimos 7 dias</p>
        </div>
        
        <div class="sk-chart-bars">
          <div v-for="day in chartData" :key="day.date" class="sk-chart-column">
            <div class="sk-bar-group">
              <div class="sk-bar new" :style="{ height: (day.new / maxVal) * 100 + '%' }" :title="'Novos: ' + day.new"></div>
              <div class="sk-bar resolved" :style="{ height: (day.resolved / maxVal) * 100 + '%' }" :title="'Resolvidos: ' + day.resolved"></div>
            </div>
            <span class="sk-bar-label">{{ day.date }}</span>
          </div>
        </div>

        <div class="sk-chart-legend">
          <div class="legend-item"><span class="dot new"></span> Novos</div>
          <div class="legend-item"><span class="dot resolved"></span> Resolvidos</div>
        </div>
      </div>

      <div class="sk-dashboard-aside sk-glass">
        <h3>Status dos Agentes</h3>
        <div class="sk-agent-stats">
          <div class="agent-stat-row">
            <span class="status-dot online"></span>
            <span class="label">Online</span>
            <span class="count">{{ stats.counts.agents_online || 0 }}</span>
          </div>
          <div class="agent-stat-row">
            <span class="status-dot away"></span>
            <span class="label">Ausente</span>
            <span class="count">{{ stats.counts.agents_away || 0 }}</span>
          </div>
          <div class="agent-stat-row">
            <span class="status-dot offline"></span>
            <span class="label">Offline</span>
            <span class="count">{{ stats.counts.agents_offline || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sk-dashboard {
  padding: var(--sk-sp-lg);
  display: flex;
  flex-direction: column;
  gap: var(--sk-sp-lg);
  height: calc(100vh - var(--sk-header-h));
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

.sk-dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--sk-sp-md);
}

.sk-stat-card {
  padding: var(--sk-sp-lg);
  display: flex;
  align-items: center;
  gap: var(--sk-sp-md);
  border-radius: var(--sk-r-lg);
}

.sk-stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--sk-r-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sk-stat-icon svg {
  width: 24px;
  height: 24px;
}

.sk-stat-info label {
  font-size: var(--sk-fs-micro);
  font-weight: var(--sk-fw-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--sk-text-3);
  display: block;
  margin-bottom: 4px;
}

.sk-stat-info .value {
  font-family: var(--sk-font-display);
  font-size: 1.5rem;
  font-weight: var(--sk-fw-extra);
  color: var(--sk-text-1);
  line-height: 1;
}

.sk-stat-info .trend {
  font-size: 10px;
  color: var(--sk-text-2);
  margin-top: 4px;
}

.sk-dashboard-row {
  display: flex;
  gap: var(--sk-sp-md);
  flex: 1;
  min-height: 400px;
}

.sk-chart-container {
  flex: 2;
  border-radius: var(--sk-r-lg);
  padding: var(--sk-sp-lg);
  display: flex;
  flex-direction: column;
}

.sk-chart-header h3 {
  font-family: var(--sk-font-display);
  font-size: 1.125rem;
  font-weight: var(--sk-fw-bold);
}

.sk-chart-header p {
  font-size: var(--sk-fs-caption);
  color: var(--sk-text-3);
  margin-bottom: var(--sk-sp-xl);
}

.sk-chart-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: var(--sk-sp-md);
  padding-bottom: var(--sk-sp-md);
  border-bottom: 1px solid var(--sk-border-s);
}

.sk-chart-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sk-sp-xs);
  width: 100%;
}

.sk-bar-group {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 200px;
  width: 40px;
}

.sk-bar {
  width: 18px;
  border-radius: 4px 4px 0 0;
  transition: height 1s var(--sk-ease);
}

.sk-bar.new {
  background: linear-gradient(to top, var(--sk-blue), #5ac8fa);
}

.sk-bar.resolved {
  background: linear-gradient(to top, #34c759, #30d158);
}

.sk-bar-label {
  font-size: 10px;
  font-weight: var(--sk-fw-bold);
  color: var(--sk-text-3);
  text-transform: uppercase;
}

.sk-chart-legend {
  display: flex;
  gap: var(--sk-sp-md);
  margin-top: var(--sk-sp-md);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--sk-fs-micro);
  font-weight: var(--sk-fw-semibold);
  color: var(--sk-text-2);
}

.legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.legend-item .dot.new { background: var(--sk-blue); }
.legend-item .dot.resolved { background: #34c759; }

.sk-dashboard-aside {
  flex: 1;
  border-radius: var(--sk-r-lg);
  padding: var(--sk-sp-lg);
}

.sk-dashboard-aside h3 {
  font-family: var(--sk-font-display);
  font-size: 1rem;
  font-weight: var(--sk-fw-bold);
  margin-bottom: var(--sk-sp-lg);
}

.sk-agent-stats {
  display: flex;
  flex-direction: column;
  gap: var(--sk-sp-md);
}

.agent-stat-row {
  display: flex;
  align-items: center;
  gap: var(--sk-sp-sm);
  padding: var(--sk-sp-sm);
  background: rgba(0,0,0,0.02);
  border-radius: var(--sk-r-sm);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online { background: #34c759; box-shadow: 0 0 8px rgba(52, 199, 89, 0.4); }
.status-dot.away { background: #ff9f0a; }
.status-dot.offline { background: #86868b; }

.agent-stat-row .label {
  font-size: var(--sk-fs-caption);
  font-weight: var(--sk-fw-medium);
  flex: 1;
}

.agent-stat-row .count {
  font-weight: var(--sk-fw-bold);
  font-size: var(--sk-fs-caption);
}
</style>
