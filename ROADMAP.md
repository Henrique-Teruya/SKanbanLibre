# SKanban — Roadmap de Customização do LibreDesk

## Visão Geral

O projeto **SKanban** foi desenvolvido como uma camada de customização visual e operacional sobre o **LibreDesk**, preservando integralmente a arquitetura original do sistema.

> [!IMPORTANT]
> **Estratégia Principal**:
>
> - Preservar o core do LibreDesk
> - Evitar forks destrutivos
> - Implementar extensões desacopladas
> - Criar identidade própria sem comprometer atualizações futuras

---

## Objetivo do Projeto

Transformar o LibreDesk em uma plataforma mais amigável, visual e operacional, orientada a Kanban e preparada para expansão omnichannel, sem a necessidade de reconstruir o backend ou remover funcionalidades nativas.

---

## Arquitetura da Solução

O SKanban funciona como uma sobreposição estruturada:

```text
LibreDesk Core
        ↓
Camada Visual SKanban
        ↓
Experiência Omnichannel Customizada
```

---

## Filosofia Técnica

### Regra de Ouro

**99% do código original do LibreDesk foi preservado.** Nenhuma lógica principal foi removida.

Todas as customizações foram implementadas como:

- Adições e Overlays
- Extensões e Novas Views
- Sobrescritas isoladas e Componentes desacoplados

---

## Stack Tecnológica

### Core Original

- **Backend**: Go
- **Frontend**: Vue.js
- **Cache/Queue**: Redis
- **Database**: PostgreSQL

### Camada SKanban

- CSS Escopado (`.theme-skanban`)
- Componentes Vue Customizados
- Persistência via `localStorage`
- Interatividade Drag and Drop
- Board Kanban Operacional

---

## Roadmap de Implementações

### 1. Estrutura Inicial do Projeto

Após análise técnica, decidimos **utilizar o LibreDesk como base estrutural** em vez de desenvolver um frontend do zero.

**Motivos da Decisão**:

- **Backend Estruturado**: Base sólida em Go que fornece alta performance e uma arquitetura de serviços madura.
- **Granularidade e Regras de Negócio**: Lógica já implementada para permissões detalhadas, cargos e fluxos operacionais.
- **Omnichannel Nativo**: Suporte multicanal funcional com atribuição de agentes e gestão de filas pronta para uso.
- **Templates de Deploy**: Infraestrutura preparada com Docker e configurações padronizadas, facilitando o go-live.
- **Escalabilidade**: Sistema já testado e preparado para lidar com grandes volumes de dados e conexões simultâneas.

### 2. Criação da Identidade SKanban

O objetivo foi criar uma identidade visual premium sem alterar o core. Toda a customização visual reside no arquivo `skanban-theme.css`.

**Estratégia de Isolamento**:
Toda a estilização é construída sob o escopo `.theme-skanban { }`, garantindo:

- Isolamento total e reversibilidade.
- Ausência de conflitos com atualizações futuras do LibreDesk.
- **Características**: Tipografia própria, glassmorphism, micro-animações e redesign operacional.

### 3. Sistema de Alternância de Temas

Permite a troca entre o LibreDesk Original e o SKanban sem necessidade de rebuild ou reload estrutural.

- **Toggle**: Adicionado ao menu do usuário com persistência via `localStorage`.
- **Segurança**: Se o arquivo `skanban-theme.css` for removido, o LibreDesk continua funcionando perfeitamente.

### 4. Sidebar Customizada

Focada em melhorar a navegação operacional do inbox através de:

- **Ícones Visuais**: Leitura operacional mais rápida.
- **Lista de Status**: Visualização amigável de situações e contextos.
- **Estratégia**: Implementado como extensão visual, sem remoção de componentes originais.
- **Adição da página de kanban**: A página de kanban foi adicionada como uma nova visualização operacional do sistema para gestão moderna de fluxos.

### 5. Criação da Tela Kanban

Uma nova visualização operacional adicionada ao sistema para gestão moderna de fluxos.

- **Funcionalidades**: Organização por status, Drag and Drop e agrupamento operacional.
- **Estrutura**: A tela foi **adicionada** e não substituiu as telas originais, proporcionando uma gestão visual superior e redução de complexidade.

### 6. Estrutura Omnichannel

O SKanban atua como uma **camada operacional unificada** sobre os diversos canais do LibreDesk (WhatsApp, E-mail, Portal do Cliente, etc).

---

## 📜 Histórico de Implementações Concluídas

Implementamos uma camada completa de identidade visual através do `skanban-theme.css`, responsável por aplicar toda a estética do SKanban de forma isolada e reversível. O tema foi desenvolvido utilizando escopo CSS, garantindo que nenhuma estilização impacte o LibreDesk original.

Também foi criado um sistema inteligente de alternância de temas persistente, permitindo que o usuário escolha dinamicamente sua experiência. No aspecto operacional, realizamos customizações na sidebar principal para tornar a navegação mais fluida para equipes de suporte.

A principal entrega estrutural foi o **Board Kanban**, desenvolvido como uma nova camada operacional que permite organizar atendimentos por status com tecnologia drag-and-drop, preservando toda a compatibilidade do sistema base.

---

## Conclusão

O SKanban é uma **extensão visual e operacional do LibreDesk**, e não um fork destrutivo. Toda a arquitetura foi planejada para reduzir riscos técnicos, facilitar a manutenção e permitir uma evolução contínua, transformando o LibreDesk em uma plataforma com identidade própria sem comprometer sua robustez original.
