<template>
  <div class="customization-list space-y-4">
    <div v-if="loading" class="flex justify-center py-8">
      <Spinner />
    </div>
    <div v-else-if="customizations.length === 0" class="text-center py-8 text-muted-foreground">
      {{ t('customizations.empty') }}
    </div>
    <div v-else class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <CustomizationCard
        v-for="item in customizations"
        :key="item.id"
        :id="item.id"
        :title="item.title"
        :description="item.description"
        :type="item.type"
        :active="item.active"
        :created-at="item.created_at"
        @toggle="$emit('toggle', item.id)"
        @edit="$emit('edit', item)"
        @delete="$emit('delete', item.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { Spinner } from '@shared-ui/components/ui/spinner'
import CustomizationCard from './CustomizationCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  customizations: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle', 'edit', 'delete'])
</script>