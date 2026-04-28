<template>
  <div class="p-8">
    <div v-if="customization" class="space-y-6">
      <!-- Se houver um componente físico, renderiza ele -->
      <div v-if="DynamicComponent" class="customization-container">
        <component :is="DynamicComponent" v-bind="customization.config?.props || {}" />
      </div>

      <!-- Caso contrário, mostra o layout padrão de debug -->
      <div v-else class="space-y-6">
        <div class="flex items-center justify-between border-b pb-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">{{ customization.title }}</h1>
            <p class="text-muted-foreground">{{ customization.description }}</p>
          </div>
          <div class="flex items-center gap-2">
            <Badge v-if="customization.active" variant="default">Ativa</Badge>
            <Badge v-else variant="secondary">Inativa</Badge>
          </div>
        </div>

        <div class="rounded-lg border border-dashed p-12 text-center bg-muted/20">
          <h2 class="text-xl font-semibold mb-2">Página Virtual: {{ customization.title }}</h2>
          <p class="text-muted-foreground mb-6">
            Para editar esta página com código real, crie o arquivo:<br>
            <code class="bg-muted px-2 py-1 rounded text-primary">frontend/apps/main/src/customizations/{{ componentName }}.vue</code>
          </p>
          <div class="flex justify-center gap-4">
            <Button variant="outline" @click="$router.push({ name: 'customization-list' })">
              Voltar para Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="flex flex-col items-center justify-center py-20 text-center">
      <h2 class="text-2xl font-bold mb-2">Ops! Página não encontrada</h2>
      <p class="text-muted-foreground mb-6">Esta customização não existe ou está inativa.</p>
      <Button @click="$router.push('/')">Voltar para Início</Button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, defineAsyncComponent, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCustomizationsStore } from '@/stores/customizations'
import { Badge } from '@shared-ui/components/ui/badge'
import { Button } from '@shared-ui/components/ui/button'

const route = useRoute()
const store = useCustomizationsStore()
const DynamicComponent = shallowRef(null)

const customization = computed(() => {
  return store.customizations.find(c => 
    c.type === 'page' && 
    (c.config?.route === route.path || c.config?.route === route.path.slice(0, -1))
  )
})

const componentName = computed(() => {
  if (!customization.value) return ''
  // Prioriza o nome do componente no config, senão usa o título formatado
  return customization.value.config?.component || customization.value.title.charAt(0).toUpperCase() + customization.value.title.slice(1).replace(/\s+/g, '')
})

const loadComponent = async () => {
  if (!componentName.value) {
    DynamicComponent.value = null
    return
  }

  try {
    // Tenta carregar o componente da pasta customizations
    // Importante: O caminho deve ser relativo ao diretório atual ou usar aliases
    const modules = import.meta.glob('@main/customizations/*.vue')
    const match = modules[`/apps/main/src/customizations/${componentName.value}.vue`]
    
    if (match) {
      DynamicComponent.value = defineAsyncComponent(match)
    } else {
      DynamicComponent.value = null
    }
  } catch (error) {
    console.error('Erro ao carregar componente customizado:', error)
    DynamicComponent.value = null
  }
}

watch(customization, loadComponent, { immediate: true })

onMounted(async () => {
  if (store.customizations.length === 0) {
    await store.fetchCustomizations()
  }
})
</script>
