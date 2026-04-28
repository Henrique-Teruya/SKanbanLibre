# ADR-0001: Sistema de Customizações do Frontend

**Status**: Proposed
**Date**: 2026-04-28
**Deciders**: @henrique

## Contexto

O projeto Libredesk (anteriormente SbancoLibre) necessita implementar customizações flexíveis para atender diferentes necessidades de clientes. O sistema atual contempla uma estrutura robusta de frontend (Vue 3) e backend (Go), mas carece de um mecanismo padronizado para:

1. Novas páginas e rotas
2. Componentes reutilizáveis em páginas existentes
3. Extensão de funcionalidades existentes

A equipe precisa de um processo documentado para implementar essas customizações de forma organizada e rastreável.

## Decisão

Adotar o seguinte sistema de customizações:

### 1. Nova Página/Rota

- Nova página como rota completa usando padrão Vue Router existente
- Views localizadas em `apps/main/src/views/`
- Novos layouts em `apps/main/src/layouts/`
- Registrar rotas no router `apps/main/src/router/index.js`

### 2. Componente em Página Existente

- Novos componentes em `apps/main/src/components/` ou `shared-ui/components/`
- Components de features em `apps/main/src/features/`
- Reutilizar padrões existentes de composição

### 3. Extensão de Funcionalidade

- Estender stores existentes (Pinia) quando possível
- Criar novos stores apenas quando necessário
- Usar composables para lógica reutilizável

## Consequências

**Bom**: Estrutura padronizada, fácil manutenção, código consistente.

**Ruim**: Curva de aprendizado para novos padrões, necessidade de seguir convenções.

**Mitigações**: Documentação em ADRs, exemplos de código, code review.

---

# ADR-0002: Estrutura de Páginas do Frontend

**Status**: Proposed
**Date**: 2026-04-28
**Deciders**: @henrique

## Contexto

O frontend atual possui aproximadamente 70+ rotas e 300+ componentes Vue. Precisa-se de uma estrutura clara para novas páginas.

## Decisão

Usar a estrutura existente:

| Tipo | Localização |
|------|--------------|
| Views | `apps/main/src/views/[domain]/` |
| Componentes | `apps/main/src/components/` |
| Features | `apps/main/src/features/[domain]/` |
| Layouts | `apps/main/src/layouts/` |
| Stores | `apps/main/src/stores/` |
| API | `apps/main/src/api/` |

## Consequências

**Bom**: Segue padrões existentes, fácil navegação no código.

**Ruim**: Múltplos diretórios podem confundir.

---

# ADR-0003: Padrão de Componentes Vue

**Status**: Proposed
**Date**: 2026-04-28
**Deciders**: @henrique

## Contexto

O projeto usa Composition API com `<script setup>`. Precisamos padronizar novos componentes.

## Decisão

Seguir padrões estabelecidos:

```vue
<script setup>
import { ref } from 'vue'
</script>

<template>
  <!-- Tailwind CSS -->
</template>
```

- Usar radix-vue/ui para componentes base
- Composition API com `<script setup>`
- Tailwind CSS para estilos
- Convenções de nomenclatura (PascalCase, camelCase)

## Consequências

**Bom**: Código consistente, melhor manutibilidade.

---

# ADR-0004: Gerenciamento de Estado

**Status**: Proposed
**Date**: 2026-04-28
**Deciders**: @henrique

## Contexto

O projeto usa Pinia para estado global. Novas funcionalidades precisam seguir padrão.

## Decisão

- Usarstores Pinia existentes quando possível
- Criar novos stores apenas para estado global
- Usar composables para estado local/compartilhado
- Stores em `apps/main/src/stores/`

## Consequências

**Bom**: Estado consistente, padrão establecido.

**Ruim**: Pode criar stores desnecessários.

**Mitigações**: Revisão de código para validar necessidade.