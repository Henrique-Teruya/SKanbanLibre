import { getCurrentInstance } from 'vue'

export function useEmitter() {
  const instance = getCurrentInstance()
  if (!instance) return null
  return instance.appContext.config.globalProperties.emitter
}
