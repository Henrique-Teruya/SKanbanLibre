# Guia de Utilização - Sistema de Customizações

## Visão Geral

O sistema de customizações permite estender a aplicação Libredesk de três formas:
- **Page**: Novas páginas/rotas completas
- **Component**: Componentes reutilizáveis em páginas existentes
- **Extension**: Extensão de funcionalidades existentes

## Acessando o painel de customizações

1. Acesse o menu **Admin** → **Integration** → **Customizations**
2. Ou diretamente via URL: `/admin/customizations`

## Criando uma Customização

### Passo 1: Acessar formulário
- Clique no botão **"Nova Customização"** na lista de customizações

### Passo 2: Preencher formulário

| Campo | Descrição |
|-------|-----------|
| **Título** | Nome identificador da customização |
| **Descrição** | Descrição opcional do que a customização faz |
| **Tipo** | `page`, `component` ou `extension` |
| **Ativa** | Controla se a customização está em uso |
| **Config** | JSON de configuração específica para o tipo |

### Passo 3: Salvar
- Clique em **Criar** para salvar a customização

## Tipos de Customização

### Page (Página)
Cria uma nova rota/página na aplicação.

**Configuração esperada:**
```json
{
  "route": "/caminho/da-rota",
  "component": "nome-do-componente",
  "layout": "default"
}
```

### Component (Componente)
Adiciona um componente reutilizável em páginas existentes.

**Configuração esperada:**
```json
{
  "target": "nome-da-view",
  "position": "sidebar|header|footer",
  "props": {}
}
```

### Extension (Extensão)
Estende funcionalidades existentes.

**Configuração esperada:**
```json
{
  "extends": "nome-do-store-ou-feature",
  "hooks": ["beforeCreate", "afterUpdate"],
  "config": {}
}
```

## Gerenciando Customizações

### Listar customizações
Acesse `/admin/customizations` para ver todas as customizações cadastradas.

### Editar customização
1. Clique no nome da customização na lista
2. Ou clique no ícone de edição (lápis)

### Ativar/Desativar
Use o toggle na lista ou no formulário para ativar/desativar uma customização.

### Excluir customização
1. Clique no ícone de lixeira
2. Confirme a exclusão no modal

## API Reference

### Store (Pinia)
```javascript
import { useCustomizationsStore } from '@/stores/customizations'

const store = useCustomizationsStore()

// Buscar todas
await store.fetchCustomizations()

// Criar
await store.createCustomization({ title: 'X', type: 'page', config: {} })

// Atualizar
await store.updateCustomization(id, { title: 'X' })

// Deletar
await store.deleteCustomization(id)

// Toggle
await store.toggleCustomization(id)
```

### Composable
```javascript
import { useCustomizations, CUSTOMIZATION_TYPES } from '@/composables/useCustomizations'

const { 
  customizations,
  pageCustomizations,
  componentCustomizations,
  extensionCustomizations,
  activeCustomizations,
  fetchAll,
  create,
  update,
  remove,
  toggle
} = useCustomizations()
```

### Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/customizations` | Lista todas |
| GET | `/api/v1/customizations/:id` | Detalhes |
| POST | `/api/v1/customizations` | Cria |
| PUT | `/api/v1/customizations/:id` | Atualiza |
| DELETE | `/api/v1/customizations/:id` | Remove |
| PUT | `/api/v1/customizations/:id/toggle` | Ativa/Desativa |

## Estrutura de Arquivos

```
frontend/apps/main/src/
├── stores/
│   └── customizations.js          # Store Pinia
├── composables/
│   └── useCustomizations.js       # Composable
├── features/
│   └── customizations/
│       ├── CustomizationCard.vue  # Card de visualização
│       ├── CustomizationForm.vue  # Formulário de edição
│       └── CustomizationList.vue  # Lista reutilizável
├── views/admin/
│   └── customizations/
│       ├── Customizations.vue      # Layout wrapper
│       ├── CustomizationList.vue  # Lista principal
│       ├── CreateCustomization.vue
│       └── EditCustomization.vue
├── features/admin/
│   └── customizations/
│       ├── dataTableColumns.js
│       └── dataTableDropdown.vue
└── api/
    └── index.js                   # Endpoints API
```

## Boas Práticas

1. **Nomeação clara**: Use nomes descritivos para identificar a customização
2. **Descrição**: Sempre adicione descrição para facilitar manutenção
3. **Configuração válida**: Valide o JSON de configuração antes de salvar
4. **Tipos corretos**: Escolha o tipo adequado para o objetivo da customização
5. **Teste local**: Teste customizações em ambiente de desenvolvimento antes de produção
