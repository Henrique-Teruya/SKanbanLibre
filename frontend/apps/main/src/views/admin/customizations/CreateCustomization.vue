<template>
  <div>
    <CustomizationForm
      :is-loading="formLoading"
      :submit-form="handleSubmit"
      :submit-label="$t('globals.messages.create')"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEmitter } from '@/composables/useEmitter'
import { EMITTER_EVENTS } from '@/constants/emitterEvents.js'
import { handleHTTPError } from '@shared-ui/utils/http.js'
import CustomizationForm from '@/features/customizations/CustomizationForm.vue'
import { useCustomizationsStore } from '@/stores/customizations'

const router = useRouter()
const emit = useEmitter()
const store = useCustomizationsStore()
const formLoading = ref(false)

const handleSubmit = async (values) => {
  formLoading.value = true
  try {
    await store.createCustomization(values)
    emit.emit(EMITTER_EVENTS.REFRESH_LIST, { model: 'customizations' })
    emit.emit(EMITTER_EVENTS.SHOW_TOAST, {
      description: 'Customização criada com sucesso'
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