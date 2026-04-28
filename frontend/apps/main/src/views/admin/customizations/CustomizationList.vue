<template>
  <LoadingOverlay :loading="formLoading" reserve-height>
    <div class="flex justify-end mb-5">
      <router-link :to="{ name: 'new-customization' }">
        <Button>{{ $t('customizations.new') }}</Button>
      </router-link>
    </div>
    <div>
      <DataTable :columns="createColumns($t)" :data="store.customizations" :loading="formLoading" />
    </div>
  </LoadingOverlay>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DataTable from '@/components/datatable/DataTable.vue'
import { createColumns } from '@/features/admin/customizations/dataTableColumns.js'
import LoadingOverlay from '@/components/layout/LoadingOverlay.vue'
import { useEmitter } from '@/composables/useEmitter'
import { EMITTER_EVENTS } from '@/constants/emitterEvents.js'
import { handleHTTPError } from '@shared-ui/utils/http.js'
import { Button } from '@shared-ui/components/ui/button'
import { useCustomizationsStore } from '@/stores/customizations'

const formLoading = ref(false)
const store = useCustomizationsStore()
const emit = useEmitter()

onMounted(() => {
  getCustomizations()
  emit.on(EMITTER_EVENTS.REFRESH_LIST, refreshList)
})

onUnmounted(() => {
  emit.off(EMITTER_EVENTS.REFRESH_LIST, refreshList)
})

const refreshList = (data) => {
  if (data?.model === 'customizations') getCustomizations()
}

const getCustomizations = async () => {
  try {
    formLoading.value = true
    await store.fetchCustomizations()
  } catch (error) {
    emit.emit(EMITTER_EVENTS.SHOW_TOAST, {
      variant: 'destructive',
      description: handleHTTPError(error).message
    })
  } finally {
    formLoading.value = false
  }
}
</script>