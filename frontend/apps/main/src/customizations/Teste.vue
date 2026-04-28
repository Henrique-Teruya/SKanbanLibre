<template>
  <div class="bg-white p-6 rounded-lg shadow-md border-2 border-dashed border-blue-500">
    <h2 class="text-2xl font-bold text-blue-600 mb-4">Olá da página customizada!</h2>
    <p class="text-gray-700">
      Este arquivo está em <code>frontend/apps/main/src/customizations/Teste.vue</code>.
    </p>
    <p class="mt-4">
      Você pode editar este arquivo livremente e as mudanças aparecerão em tempo real.
    </p>
    <div class="mt-6 flex gap-2">
      <button 
        @click="count++" 
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Contador: {{ count }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>
