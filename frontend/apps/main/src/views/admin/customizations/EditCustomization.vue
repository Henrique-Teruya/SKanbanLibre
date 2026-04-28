<template>
  <div v-if="!loading">
    <CustomizationForm
      :initial-values="customization"
      :is-loading="formLoading"
      :submit-form="handleSubmit"
      :submit-label="$t('globals.messages.save')"
    />
  </div>
  <div v-else class="flex justify-center py-8">
    <Spinner />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmitter } from '@/composables/useEmitter'
import { EMITTER_EVENTS } from '@/constants/emitterEvents.js'
import { handleHTTPError } from '@shared-ui/utils/http.js'
import CustomizationForm from '@/features/customizations/CustomizationForm.vue'
import { useCustomizationsStore } from '@/stores/customizations'
import { Spinner } from '@shared-ui/components/ui/spinner'
import api from '@/api'

const route = useRoute()
const router = useRouter()
const emit = useEmitter()
const store = useCustomizationsStore()
const formLoading = ref(false)
const loading = ref(false)
const customization = ref({})

onMounted(async () => {
  loading.value = true
  try {
    const response = await api.getCustomization(route.params.id)
    customization.value = response?.data?.data || {}
  } catch (error) {
    emit.emit(EMITTER_EVENTS.SHOW_TOAST, {
      variant: 'destructive',
      description: handleHTTPError(error).message
    })
    router.push({ name: 'customization-list' })
  } finally {
    loading.value = false
  }
})

const handleSubmit = async (values) => {
  formLoading.value = true
  try {
    await store.updateCustomization(route.params.id, values)
    emit.emit(EMITTER_EVENTS.REFRESH_LIST, { model: 'customizations' })
    emit.emit(EMITTER_EVENTS.SHOW_TOAST, {
      description: 'Customização atualizada com sucesso'
    })
    router.push({ name: 'customization-list' })
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