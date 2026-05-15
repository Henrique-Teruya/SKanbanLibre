# 🚀 SKanban — Modern Omnichannel Support Desk

SKanban is a high-performance, open-source, and self-hosted omnichannel customer support platform. It is built as a **non-destructive visual and operational overlay** on top of [LibreDesk](https://libredesk.io), transforming the user experience with a modern Kanban-oriented interface while preserving 100% of the original core stability.

![SKanban Banner](https://libredesk.io/hero-dark-v2.png?q=2)

---

## 💡 Por que SKanban? (Resumo em Português)

O **SKanban** foi desenvolvido para elevar a experiência do LibreDesk a um novo patamar de produtividade e estética. 
- **Gestão Visual**: Introduzimos um Board Kanban completo para organizar atendimentos por status.
- **Design Premium**: Implementamos o sistema de design **SKR Premium**, inspirado no minimalismo e elegância da Apple (glassmorphism, tipografia Montserrat e micro-animações).
- **Sem Perda de Dados**: O SKanban funciona como uma "capa inteligente". Você pode alternar entre o visual clássico e o novo a qualquer momento, sem afetar as funcionalidades nativas do backend em Go.

---

## 🌟 The SKanban Philosophy

Unlike traditional forks that rewrite the codebase, SKanban operates as a **structural layer**:
- **99% Core Preservation**: All original LibreDesk Go logic and Vue components remain intact.
- **Visual Overlay**: Deep UI customization via scoped CSS (`.theme-skanban`) and **SKR Premium** design system.
- **Operational Extensions**: New views like the **Board Kanban** are added as enhancements, not replacements.
- **Dynamic Switching**: Users can toggle between the classic LibreDesk and the premium SKanban experience in real-time.

---

## ✨ Key Features

### 📋 Board Kanban (Exclusive)
A modern, drag-and-drop operational board to manage your conversations. Organize your workflow by status, priority, or custom stages.

### 🎨 SKR Premium Design System
- **Glassmorphism**: High-fidelity materials with backdrop blur.
- **Dynamic Depth**: GPU-accelerated background blobs and smooth view transitions.
- **Montserrat Typography**: Luxury-grade font hierarchy for better readability and brand identity.

### 📥 Omnichannel Inbox
Manage Live Chat, Email, WhatsApp, and more from a single, unified interface. Connect multiple support channels and handle everything in one place.

### 🤖 Intelligent Automations
- **Auto-Assignment**: Route conversations based on agent capacity or custom rules.
- **Macros**: One-click responses for frequently asked questions.
- **SLA Management**: Track response times and get alerts before breaches occur.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Go (Golang) |
| **Frontend** | Vue 3 (Composition API), Pinia, Tailwind CSS |
| **Design** | SKR Premium (Glassmorphism, Montserrat) |
| **Database** | PostgreSQL |
| **Cache / Queue** | Redis |
| **Infrastructure** | Docker, Makefile, stuffbin |

---

## 🚀 Quick Start

### Running with Docker

The easiest way to get started is using Docker Compose:

```bash
# 1. Download the environment files
curl -LO https://github.com/henrique/SKanbanLibre/raw/main/docker-compose.yml
curl -LO https://github.com/henrique/SKanbanLibre/raw/main/config.sample.toml

# 2. Setup configuration
cp config.sample.toml config.toml

# 3. Start the services
docker compose up -d

# 4. Set your admin password
docker exec -it libredesk_app ./libredesk --set-system-user-password
```

Visit `http://localhost:9000` and login with user `System`.

---

## 👨‍💻 Local Development

### Prerequisites
- [Go](https://golang.org/doc/install) 1.21+
- [Node.js](https://nodejs.org/) & [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/) & [Redis](https://redis.io/)

### Frontend Setup
```bash
cd frontend
pnpm install

# Run Main App (Port 8000)
pnpm dev:main

# Run Chat Widget (Port 8001)
pnpm dev:widget
```

### Backend Setup
```bash
# Run backend
go run ./cmd/
```

### Makefile Commands
| Command | Description |
| :--- | :--- |
| `make build` | Full production build (Frontend + Backend) |
| `make run-frontend` | Start frontend dev server |
| `make run-backend` | Start backend dev server |
| `make test` | Run all tests (Go + Vue) |

---

## 🗺️ Roadmap & Design

- 📈 [Check our Roadmap](./ROADMAP.md) for planned features and history.
- 🎨 [Explore Design Principles](./DESIGN.md) behind the SKanban interface.
- 🤝 [Read Contributing Guide](./CONTRIBUTING.md) to join the project.

---

## 🌍 Supported Languages
SKanban currently supports: English, Portuguese, German, French, Spanish, Persian, Italian, Japanese, and Marathi. Help us translate on [Crowdin](https://crowdin.com/project/libredesk).

---

## 📄 License
SKanban is licensed under the [AGPL-3.0 License](./LICENSE). Based on the original LibreDesk project.

---

<p align="center">
  Built with ❤️ by the SKanban Team.
</p>
