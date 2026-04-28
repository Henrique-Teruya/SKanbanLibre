<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only"></span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @click="editCustomization">{{ $t('globals.messages.edit') }}</DropdownMenuItem>
      <DropdownMenuItem @click="toggleCustomization">{{ $t('customizations.toggle') }}</DropdownMenuItem>
      <DropdownMenuItem @click="() => (isDeleteOpen = true)">
        {{ $t('globals.messages.delete') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <AlertDialog :open="isDeleteOpen" @update:open="isDeleteOpen = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ $t('globals.messages.areYouAbsolutelySure') }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ $t('confirm.deleteCustomization') }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ $t('globals.messages.cancel') }}</AlertDialogCancel>
        <AlertDialogAction @click="handleDelete">{{
          $t('globals.messages.delete')
        }}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup>
import { ref } from 'vue'
import { MoreHorizontal } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@shared-ui/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@shared-ui/components/ui/alert-dialog'
import { Button } from '@shared-ui/components/ui/button'
import { useEmitter } from '@/composables/useEmitter'
import { EMITTER_EVENTS } from '@/constants/emitterEvents.js'
import { useRouter } from 'vue-router'
import { useCustomizationsStore } from '@/stores/customizations'
import api from '@/api/index.js'

const router = useRouter()
const emit = useEmitter()
const store = useCustomizationsStore()
const isDeleteOpen = ref(false)

const props = defineProps({
  customization: {
    type: Object,
    required: true
  }
})

const handleDelete = async () => {
  await api.deleteCustomization(props.customization.id)
  await store.fetchCustomizations()
  isDeleteOpen.value = false
  emit.emit(EMITTER_EVENTS.REFRESH_LIST, { model: 'customizations' })
}

const toggleCustomization = async () => {
  await api.toggleCustomization(props.customization.id)
  await store.fetchCustomizations()
  emit.emit(EMITTER_EVENTS.REFRESH_LIST, { model: 'customizations' })
}

const editCustomization = () => {
  router.push({ name: 'edit-customization', params: { id: props.customization.id } })
}
</script>