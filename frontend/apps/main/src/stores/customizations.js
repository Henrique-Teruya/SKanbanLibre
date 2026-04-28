import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import api from '../api'

export const useCustomizationsStore = defineStore('customizations', () => {
  const _customizations = ref([])
  const _loading = ref(false)
  const _error = ref(null)

  const loading = computed(() => _loading.value)
  const error = computed(() => _error.value)

  const getCustomizationsByType = computed(() => (type) =>
    _customizations.value.filter(c => c.type === type)
  )

  const getActiveCustomizations = computed(() =>
    _customizations.value.filter(c => c.active)
  )

  async function fetchCustomizations() {
    _loading.value = true
    _error.value = null
    try {
      const response = await api.getCustomizations()
      _customizations.value = response?.data?.data || []
    } catch (error) {
      // Fallback to localStorage
      const local = localStorage.getItem('libredesk_customizations')
      _customizations.value = local ? JSON.parse(local) : []
    } finally {
      _loading.value = false
    }
  }

  async function createCustomization(data) {
    try {
      const response = await api.createCustomization(data)
      const created = response?.data?.data
      if (created) {
        _customizations.value.push(created)
      }
      return created
    } catch (error) {
      // Fallback to localStorage
      const newCustomization = {
        id: Date.now().toString(),
        ...data,
        active: true,
        createdAt: new Date().toISOString()
      }
      _customizations.value.push(newCustomization)
      saveToLocal()
      return newCustomization
    }
  }

  async function updateCustomization(id, data) {
    try {
      const response = await api.updateCustomization(id, data)
      const updated = response?.data?.data
      if (updated) {
        const index = _customizations.value.findIndex(c => c.id === id)
        if (index !== -1) {
          _customizations.value[index] = updated
        }
      }
      return updated
    } catch (error) {
      // Fallback to localStorage
      const index = _customizations.value.findIndex(c => c.id === id)
      if (index !== -1) {
        _customizations.value[index] = { ..._customizations.value[index], ...data }
        saveToLocal()
        return _customizations.value[index]
      }
      return null
    }
  }

  async function deleteCustomization(id) {
    try {
      await api.deleteCustomization(id)
      _customizations.value = _customizations.value.filter(c => c.id !== id)
      return true
    } catch (error) {
      // Fallback to localStorage
      _customizations.value = _customizations.value.filter(c => c.id !== id)
      saveToLocal()
      return true
    }
  }

  function saveToLocal() {
    localStorage.setItem('libredesk_customizations', JSON.stringify(_customizations.value))
  }

  async function toggleCustomization(id) {
    const customization = _customizations.value.find(c => c.id === id)
    if (!customization) return null

    return updateCustomization(id, { active: !customization.active })
  }

  return {
    customizations: readonly(_customizations),
    loading,
    error,
    getCustomizationsByType,
    getActiveCustomizations,
    fetchCustomizations,
    createCustomization,
    updateCustomization,
    deleteCustomization,
    toggleCustomization
  }
})