<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold tracking-tight">Meu Dashboard Customizado</h2>
      <div class="flex items-center space-x-2">
        <button class="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium">
          Baixar Relatório
        </button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="rounded-xl border bg-card p-6 shadow-sm">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="text-sm font-medium">Métrica {{ i }}</h3>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="h-4 w-4 text-muted-foreground">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div class="text-2xl font-bold">+{{ 1234 * i }}</div>
        <p class="text-xs text-muted-foreground">+20.1% em relação ao mês passado</p>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div class="col-span-4 rounded-xl border bg-card p-6 shadow-sm">
        <h3 class="font-semibold mb-4">Gráfico de Atividade</h3>
        <div class="h-[200px] flex items-end gap-2 px-2">
          <div v-for="h in [40, 70, 45, 90, 65, 80, 50]" :key="h" 
               :style="{ height: h + '%' }" 
               class="flex-1 bg-primary/20 rounded-t hover:bg-primary/40 transition-all cursor-pointer">
          </div>
        </div>
      </div>
      <div class="col-span-3 rounded-xl border bg-card p-6 shadow-sm">
        <h3 class="font-semibold mb-4">Últimas Atualizações</h3>
        <div class="space-y-4">
          <div v-for="j in 3" :key="j" class="flex items-center gap-4">
            <div class="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
              U{{ j }}
            </div>
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium leading-none">Usuário {{ j }} fez uma alteração</p>
              <p class="text-xs text-muted-foreground">há {{ j * 5 }} minutos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Você pode importar seus próprios stores ou composables aqui!
</script>

<style scoped>
/* Estilos específicos para o seu Dashboard */
</style>
