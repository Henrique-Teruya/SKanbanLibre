<template>
  <div class="customization-card p-4 border rounded-lg bg-background">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <component :is="getIcon()" class="w-5 h-5 text-muted-foreground" />
        <h3 class="font-medium text-sm">{{ title }}</h3>
      </div>
      <Toggle
        :pressed="active"
        @update:pressed="$emit('toggle')"
        size="sm"
        variant="outline"
      />
    </div>
    <p class="text-xs text-muted-foreground mb-2">{{ description }}</p>
    <div class="flex items-center gap-2 text-xs text-muted-foreground">
      <Badge variant="outline">{{ type }}</Badge>
      <span>{{ formatDate(createdAt) }}</span>
    </div>
    <div class="flex gap-2 mt-3">
      <Button variant="ghost" size="sm" @click="$emit('edit')">
        <Pencil class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" @click="$emit('delete')">
        <Trash2 class="w-4 h-4" />
      </Button>
    </div>
  </div>
</template>

<script setup>
import { Page, Box, Puzzle, Pencil, Trash2 } from 'lucide-vue-next'
import { Toggle } from '@shared-ui/components/ui/toggle'
import { Button } from '@shared-ui/components/ui/button'
import { Badge } from '@shared-ui/components/ui/badge'

const props = defineProps({
  id: [String, Number],
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, required: true },
  active: { type: Boolean, default: false },
  createdAt: { type: String, default: '' }
})

defineEmits(['toggle', 'edit', 'delete'])

const typeIcons = {
  page: Page,
  component: Box,
  extension: Puzzle
}

const getIcon = () => typeIcons[props.type] || Box

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}
</script>