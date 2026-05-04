# Contexto: SKanbanUI — Adaptação para LibreDesk

Este documento detalha a análise do front-end **SKanbanUI** e o plano de ação para adaptá-lo ao ecossistema do **LibreDesk**, integrando todas as funcionalidades avançadas do projeto original sob a nova estética "Premium/Glassmorphism".

## 1. Análise do SKanbanUI

### Stack Tecnológica Atual
- **Core**: Vanilla JavaScript (ES6+), HTML5, CSS3.
- **Design System**: Baseado em variáveis CSS (`tokens.css`), utilizando técnicas de glassmorphism, sombras suaves e tipografia moderna (Montserrat).
- **Estrutura**: SPA (Single Page Application) artesanal via manipulação de DOM, com carregamento modular de scripts.
- **Componentização**: Implementada via arquivos JS separados (`modal.js`, `timeline.js`, etc.) que injetam HTML dinamicamente.

### Estado Atual das Funcionalidades
- **Autenticação**: Fluxo básico de login (session storage + Bearer token).
- **Kanban**: Visualização de "Atendimentos" em colunas de situação. Drag-and-drop ainda não funcional no core.
- **Dashboard**: Cards de estatísticas e gráficos simples (Placeholder).
- **Conversas**: Inbox lateral com visualização de timeline de mensagens.
- **Drawer/Modais**: Sistema de sobreposição robusto para detalhes de chamados.

## 2. Gaps Funcionais (LibreDesk vs SKanbanUI)

Para que o SKanbanUI substitua ou se torne o front-end oficial do LibreDesk, as seguintes funcionalidades precisam ser migradas do front-end Vue/Pinia original:

| Funcionalidade | Status no SKanbanUI | Requisito LibreDesk |
| :--- | :--- | :--- |
| **Multicanais** | Apenas genérico | WhatsApp, E-mail, Chat, API, Telegram |
| **Gestão de Equipes** | Básico (Time/Integrante) | Permissões RBAC, Atribuição automática |
| **Automação** | Ausente | Regras de automação, Webhooks, Macros |
| **Atributos Custom** | Parcial (Assuntos) | Campos dinâmicos por contato/conversa |
| **SLA & Business Hours** | Ausente | Controle de prazos e horários de operação |
| **IA Integrada** | Ausente | Sugestões de resposta, Resumos de conversa |
| **Notificações** | Básico (Badges) | Web Push, Notificações em tempo real (WebSocket) |
| **Busca Avançada** | Busca simples | Filtros complexos, busca por tags e metadados |

## 3. Estratégia de Adaptação

### Fase 1: Padronização da API
O arquivo `js/api.js` do SKanbanUI deve ser atualizado para refletir os endpoints reais do LibreDesk (`/api/v1/...`). 
- Adotar o padrão de resposta do backend Go.
- Implementar suporte a CSRF tokens (conforme visto no front original).

### Fase 2: Integração de WebSocket
O SKanbanUI atualmente depende de polling (`setInterval`) para atualizar badges. Devemos integrar o `websocket.js` do LibreDesk para:
- Atualização instantânea do Kanban.
- Recebimento de mensagens em tempo real na Timeline.

### Fase 3: Portabilidade de Lógica (Vue -> Vanilla ou Vue -> SKanbanUI)
Existem duas abordagens possíveis:
1. **Abordagem Vanilla (Atual)**: Reescrever os stores Pinia em objetos literais JS ou classes (ex: `InboxStore.js`).
2. **Abordagem Vue Refactor**: Trazer a estética do SKanbanUI (CSS/Tokens) para dentro do projeto Vue 3 existente, substituindo o Tailwind genérico.

> [!NOTE]
> Dado o pedido do usuário para "adaptar esse front end", seguiremos fortalecendo a estrutura **Vanilla JS** atual, transformando-a em uma aplicação robusta que consome o backend do LibreDesk.

## 4. Diretriz Principal de Implementação

Nossa missão principal é **implementar o Kanban sem modificar o código original do LibreDesk na medida do possível**. As adaptações devem ser isoladas e contidas dentro do escopo da própria feature do SKanban, alterando configurações ou componentes globais apenas quando explicitamente necessário (como as adaptações de CSS global mal implementadas que afetaram o site todo). Isso garante que o ecossistema original do LibreDesk não seja quebrado pela introdução da nova visão Kanban.

## 5. Próximos Passos Imediatos

1.  **Refatorar `api.js`**: Mapear todos os métodos para os endpoints `/api/v1/` do LibreDesk.
2.  **Implementar WebSocket**: Adicionar suporte a eventos em tempo real para evitar polling.
3.  **Expansão do Drawer de Detalhes**: Adicionar abas para Tags, Atributos Customizados e SLA que o LibreDesk já possui no backend.
4.  **Omnichannel UI**: Adaptar a Timeline para exibir ícones e metadados específicos de cada canal (ex: ícone de WhatsApp, status de entrega).
