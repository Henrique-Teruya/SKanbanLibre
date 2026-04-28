import { computed } from 'vue'
import { useCustomizationsStore } from '@/stores/customizations'

export const CUSTOMIZATION_TYPES = {
  PAGE: 'page',
  COMPONENT: 'component',
  EXTENSION: 'extension'
}

export function useCustomizations() {
  const store = useCustomizationsStore()

  const customizations = computed(() => store.customizations)
  const loading = computed(() => store.loading)
  const error = computed(() => store.error)

  const pageCustomizations = computed(() =>
    store.getCustomizationsByType(CUSTOMIZATION_TYPES.PAGE)
  )

  const componentCustomizations = computed(() =>
    store.getCustomizationsByType(CUSTOMIZATION_TYPES.COMPONENT)
  )

  const extensionCustomizations = computed(() =>
    store.getCustomizationsByType(CUSTOMIZATION_TYPES.EXTENSION)
  )

  const activeCustomizations = computed(() => store.getActiveCustomizations)

  async function fetchAll() {
    await store.fetchCustomizations()
  }

  async function create(data) {
    return store.createCustomization(data)
  }

  async function update(id, data) {
    return store.updateCustomization(id, data)
  }

  async function remove(id) {
    return store.deleteCustomization(id)
  }

  async function toggle(id) {
    return store.toggleCustomization(id)
  }

  return {
    customizations,
    loading,
    error,
    pageCustomizations,
    componentCustomizations,
    extensionCustomizations,
    activeCustomizations,
    fetchAll,
    create,
    update,
    remove,
    toggle,
    CUSTOMIZATION_TYPES
  }
}