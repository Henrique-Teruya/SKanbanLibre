# AGENTS.md - Agent Coding Guidelines

This document provides guidelines for agentic coding agents operating in this repository.

## Project Overview

- **Name**: libredesk (formerly LibreDesk)
- **Type**: Omnichannel customer support desk (Vue 3 frontend + Go backend)
- **Frontend**: Vue 3 with Composition API, Pinia, radix-vue/ui, Tailwind CSS
- **Package Manager**: pnpm
- **Location**: `/Users/henrique/SKanbanLibre/frontend`

## Build/Lint/Test Commands

All commands run from `frontend/` directory using pnpm:

```bash
cd frontend
pnpm <command>
```

### Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server (detects mode via `--mode main\|widget`) |
| `pnpm dev:main` | Start main app dev server on port 8000 |
| `pnpm dev:widget` | Start chat widget dev server on port 8001 |
| `pnpm build:main` | Build main app for production |
| `pnpm build:widget` | Build widget for production |

### Testing

| Command | Description |
|---------|-------------|
| `pnpm test` | Run Vitest in watch mode |
| `pnpm test:run` | Run Vitest once (CI-friendly) |
| `pnpm test:e2e` | Run Cypress e2e tests |
| `pnpm test:unit` | Run Cypress component tests (headless) |

### Running a Single Test

For Vitest: `pnpm test -- --testNamePattern "pattern"`
For Cypress e2e: `cypress run --e2e --spec "cypress/e2e/inbox.cy.js"`

### Linting & Formatting

| Command | Description |
|---------|-------------|
| `pnpm lint` | Run ESLint with auto-fix |
| `pnpm format` | Format code with Prettier |

## Code Style Guidelines

### Formatting (Prettier)

- No semicolons, 2-space tabs, single quotes, printWidth 100, no trailing commas

### Vue Component Structure

```vue
<template>
  <!-- Template with Tailwind classes -->
</template>
<script setup>
import { ref } from 'vue'
import { useStore } from '@/stores'
</script>
```

- Use `<script setup>` with Composition API
- Self-closing tags for components without content

### Import Conventions

```javascript
// Vue/composables
import { ref, computed } from 'vue'
import { useMyStore } from '@/stores/myStore'

// Icons
import { Download } from 'lucide-vue-next'

// Path aliases: @, @main, @widget, @shared-ui
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Vue components | PascalCase | InboxSidebar.vue |
| Stores | camelCase | inbox.js |
| Props/emit | camelCase | isOpen |
| CSS classes | kebab-case | text-muted-foreground |

### Types

This is a JavaScript project (no TypeScript). Use JSDoc when needed:

```javascript
/** @typedef {Object} Conversation
 * @property {string} id
 */
```

### Error Handling

```javascript
try {
  const response = await api.getData()
  return response?.data?.data || []
} catch (error) {
  return []  // Silent fail
}
```

- Prefer silent fails for non-critical ops
- Use optional chaining (`?.`)
- Return sensible defaults

### Tailwind CSS

- Use utility classes in templates
- Use design tokens: `text-primary`, `bg-background`, `border-border`
- Responsive: `md:`, `lg:` prefixes

### State Management (Pinia)

```javascript
export const useInboxStore = defineStore('inbox', {
  state: () => ({ conversations: [], loading: false }),
  getters: {
    sorted: (state) => [...state.conversations].sort((a, b) => b.id - a.id)
  },
  actions: {
    async fetch() {
      this.loading = true
      try {
        const res = await api.getConversations()
        this.conversations = res?.data?.data || []
      } finally {
        this.loading = false
      }
    }
  }
})
```

### API Calls

```javascript
import api from '@/api'
async function getInbox(params) {
  const response = await api.getInbox(params)
  return response?.data?.data || {}
}
```

## Project Structure

```
frontend/
├── apps/main/src/    # Main app
├── apps/widget/src/  # Chat widget
├── shared-ui/        # Shared UI components
├── cypress/e2e/     # E2E tests
└── src/__tests__/    # Component tests
```

## Contribution Guidelines

- Keep PRs focused and small
- Run `pnpm lint` and `pnpm format` before committing