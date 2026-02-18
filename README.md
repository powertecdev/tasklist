# 🚀 TaskList Enterprise

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Sistema corporativo de gerenciamento de tarefas com controle de equipe, permissões por papel e rastreamento de próximo passo.**

[Demo ao Vivo](https://tasklist-jet.vercel.app) · [Backend API](https://tasklist-backend-jtvy.onrender.com/api/health)

</div>

---

## 📋 Sobre o Projeto

O **TaskList Enterprise** é uma plataforma fullstack de gerenciamento de tarefas projetada para empresas. O sistema permite que administradores cadastrem funcionários, atribuam tarefas e acompanhem o progresso de toda a equipe em tempo real.

### Destaques

- **Controle por papéis** — Admin gerencia tudo, funcionários gerenciam suas próprias tarefas
- **Visibilidade total** — Todos podem ver as tarefas de todos os colegas
- **Próximo Passo** — Campo obrigatório para tarefas não concluídas, garantindo clareza sobre o que falta fazer
- **Histórico completo** — Registro de todas as tarefas concluídas e canceladas
- **Deploy com Docker** — Containerizado e pronto para produção

---

## ✨ Funcionalidades

### 👨‍💼 Administrador (ADMIN)
- Cadastrar, editar, ativar/desativar e excluir funcionários
- Criar tarefas e atribuir para qualquer funcionário
- Visualizar, editar e excluir tarefas de toda a equipe
- Dashboard com métricas globais e visão por funcionário
- Filtrar tarefas por status, prioridade, funcionário e data

### 👤 Funcionário (EMPLOYEE)
- Criar, editar e gerenciar suas próprias tarefas
- Visualizar tarefas de todos os colegas (somente leitura)
- Comentar em qualquer tarefa
- Alterar sua senha

### 📌 Sistema de Tarefas
- **4 Status:** Pendente, Em Progresso, Concluída, Cancelada
- **4 Prioridades:** Baixa, Média, Alta, Urgente
- **Próximo Passo:** Campo obrigatório para tarefas ativas (PENDING / IN_PROGRESS)
- **Prazo:** Com indicador visual de tarefas atrasadas
- **Comentários:** Sistema de comentários por tarefa
- **Histórico:** Aba dedicada para tarefas concluídas/canceladas

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 18 + TypeScript + Vite + Tailwind CSS |
| **Backend** | Node.js + Express + TypeScript |
| **Banco de Dados** | PostgreSQL |
| **ORM** | Prisma 5 |
| **Autenticação** | JWT (Access + Refresh Token com httpOnly Cookie) |
| **Validação** | Zod |
| **Containerização** | Docker + Docker Compose |
| **Deploy** | Vercel (frontend) + Render (backend + banco) |

---

## 📁 Estrutura do Projeto

```
tasklist-enterprise/
├── client/                        # Frontend React
│   ├── src/
│   │   ├── api/                   # Axios com interceptor de refresh
│   │   ├── components/
│   │   │   ├── employees/         # EmployeeCard, EmployeeForm, EmployeeList
│   │   │   ├── layout/            # Sidebar, Layout
│   │   │   ├── tasks/             # TaskCard, TaskForm, TaskList, TaskFilters
│   │   │   └── ui/                # Modal
│   │   ├── contexts/              # AuthContext (provider global)
│   │   ├── hooks/                 # useTasks, useEmployees, useAuth
│   │   ├── pages/                 # Login, Dashboard, MyTasks, AllTasks,
│   │   │                          # TeamTasks, EmployeeTaskView, ManageEmployees
│   │   ├── routes/                # AppRoutes, PrivateRoute
│   │   ├── types/                 # Interfaces TypeScript
│   │   └── utils/                 # Formatters e helpers
│   ├── .env.production
│   ├── vercel.json
│   └── package.json
│
├── server/                        # Backend Express
│   ├── src/
│   │   ├── config/                # Variáveis de ambiente
│   │   ├── controllers/           # Auth, User, Task, Comment, Dashboard
│   │   ├── middlewares/           # JWT auth, roleGuard, validate, errorHandler
│   │   ├── routes/                # Todas as rotas da API
│   │   ├── schemas/               # Validação Zod (auth, user, task)
│   │   ├── services/              # Lógica de negócio
│   │   ├── lib/                   # Prisma client
│   │   └── server.ts              # Entry point
│   ├── prisma/
│   │   ├── schema.prisma          # Modelos do banco
│   │   └── seed.ts                # Seed do admin padrão
│   ├── Dockerfile
│   ├── .env
│   └── package.json
│
├── docker-compose.yml
├── .dockerignore
└── README.md
```

---

## 🚀 Como Rodar

### Opção 1: Docker (Recomendado)

```bash
# Clonar o repositório
git clone https://github.com/powertecdev/tasklist.git
cd tasklist

# Subir tudo com Docker Compose
docker-compose up -d

# Rodar migrations e seed
docker-compose exec server npx prisma migrate dev --name init
docker-compose exec server npx prisma db seed
```

Acesse:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3333
- **Health Check:** http://localhost:3333/api/health

### Opção 2: Local (Fedora / Linux)

**Pré-requisitos:** Node.js 20+, PostgreSQL 15+

```bash
# Clonar
git clone https://github.com/powertecdev/tasklist.git
cd tasklist

# Backend
cd server
npm install
cp .env.example .env          # Configurar DATABASE_URL
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev

# Frontend (outro terminal)
cd client
npm install
npm run dev
```

---

## 🔐 Credenciais Padrão

| Campo | Valor |
|-------|-------|
| **Email** | `admin@empresa.com` |
| **Senha** | `admin123` |

> ⚠️ **Troque a senha no primeiro acesso!**

---

## 📡 API Endpoints

### Autenticação
| Método | Rota | Descrição | Acesso |
|--------|------|-----------|--------|
| `POST` | `/api/auth/login` | Login | Público |
| `POST` | `/api/auth/refresh` | Renovar token | Público |
| `POST` | `/api/auth/logout` | Logout | Auth |
| `GET` | `/api/auth/me` | Dados do usuário logado | Auth |
| `PATCH` | `/api/auth/me/password` | Alterar senha | Auth |

### Usuários
| Método | Rota | Descrição | Acesso |
|--------|------|-----------|--------|
| `GET` | `/api/users` | Listar funcionários | Auth |
| `GET` | `/api/users/:id` | Detalhes do funcionário | Auth |
| `POST` | `/api/users` | Cadastrar funcionário | Admin |
| `PUT` | `/api/users/:id` | Editar funcionário | Admin |
| `PATCH` | `/api/users/:id/toggle` | Ativar/desativar | Admin |
| `DELETE` | `/api/users/:id` | Excluir funcionário | Admin |

### Tarefas
| Método | Rota | Descrição | Acesso |
|--------|------|-----------|--------|
| `GET` | `/api/tasks` | Listar com filtros | Auth |
| `GET` | `/api/tasks/my` | Minhas tarefas | Auth |
| `GET` | `/api/tasks/user/:id` | Tarefas de um funcionário | Auth |
| `GET` | `/api/tasks/:id` | Detalhes da tarefa | Auth |
| `POST` | `/api/tasks` | Criar tarefa | Auth |
| `PUT` | `/api/tasks/:id` | Editar tarefa | Owner/Admin |
| `PATCH` | `/api/tasks/:id/status` | Alterar status | Owner/Admin |
| `DELETE` | `/api/tasks/:id` | Excluir tarefa | Owner/Admin |

### Comentários
| Método | Rota | Descrição | Acesso |
|--------|------|-----------|--------|
| `GET` | `/api/tasks/:id/comments` | Listar comentários | Auth |
| `POST` | `/api/tasks/:id/comments` | Adicionar comentário | Auth |
| `DELETE` | `/api/tasks/:id/comments/:cid` | Excluir comentário | Owner/Admin |

### Dashboard
| Método | Rota | Descrição | Acesso |
|--------|------|-----------|--------|
| `GET` | `/api/dashboard/stats` | Métricas gerais | Admin |
| `GET` | `/api/dashboard/overview` | Resumo por funcionário | Admin |

### Filtros (Query Params)
```
GET /api/tasks?status=PENDING,IN_PROGRESS&priority=HIGH,URGENT&ownerId=uuid&search=texto&sortBy=dueDate&sortOrder=asc&page=1&limit=20
```

---

## 🗄️ Modelagem do Banco

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│    Users      │     │      Tasks       │     │   Comments   │
├──────────────┤     ├──────────────────┤     ├──────────────┤
│ id (uuid)    │──┐  │ id (uuid)        │──┐  │ id (uuid)    │
│ name         │  │  │ title            │  │  │ content      │
│ email        │  │  │ description      │  │  │ createdAt    │
│ password     │  ├──│ ownerId (FK)     │  ├──│ taskId (FK)  │
│ role         │  │  │ createdById (FK) │  │  │ authorId(FK) │
│ department   │  │  │ status           │  │  └──────────────┘
│ isActive     │  │  │ priority         │  │
│ createdAt    │──┘  │ nextStep         │──┘
│ updatedAt    │     │ dueDate          │
└──────────────┘     │ completedAt      │
                     │ createdAt        │
                     │ updatedAt        │
                     └──────────────────┘
```

---

## 🐳 Docker

### docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: tasklist_user
      POSTGRES_PASSWORD: tasklist_pass_2025
      POSTGRES_DB: tasklist_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  server:
    build: ./server
    ports:
      - "3333:3333"
    environment:
      DATABASE_URL: postgresql://tasklist_user:tasklist_pass_2025@db:5432/tasklist_db
      JWT_SECRET: sua-chave-secreta-aqui
      JWT_REFRESH_SECRET: sua-chave-refresh-aqui
      NODE_ENV: production
      PORT: 3333
      CORS_ORIGIN: http://localhost:5173
    depends_on:
      - db

  client:
    build: ./client
    ports:
      - "5173:80"
    depends_on:
      - server

volumes:
  pgdata:
```

### Comandos Docker

```bash
# Subir tudo
docker-compose up -d

# Ver logs
docker-compose logs -f server

# Rodar seed
docker-compose exec server npx prisma db seed

# Parar tudo
docker-compose down

# Resetar banco
docker-compose down -v
docker-compose up -d
```

---

## 🌐 Deploy em Produção

| Serviço | Plataforma | URL |
|---------|-----------|-----|
| **Frontend** | Vercel | [tasklist-jet.vercel.app](https://tasklist-jet.vercel.app) |
| **Backend** | Render | [tasklist-backend-jtvy.onrender.com](https://tasklist-backend-jtvy.onrender.com) |
| **Banco de Dados** | Render PostgreSQL | Internal |

### Variáveis de Ambiente (Produção)

**Backend (Render):**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=chave-secreta-producao
JWT_REFRESH_SECRET=chave-refresh-producao
PORT=3333
NODE_ENV=production
CORS_ORIGIN=https://tasklist-jet.vercel.app
```

**Frontend (Vercel):**
```env
VITE_API_URL=https://tasklist-backend-jtvy.onrender.com/api
```

---

## 📌 Regras de Negócio

1. **Próximo Passo** é obrigatório quando status é `PENDING` ou `IN_PROGRESS`
2. Ao marcar como `COMPLETED`, o campo `completedAt` é preenchido e `nextStep` é limpo automaticamente
3. **Employee** só cria tarefas para si mesmo; **Admin** pode atribuir para qualquer um
4. Funcionário desativado não faz login, mas suas tarefas permanecem visíveis
5. Não é possível excluir funcionário com tarefas associadas (desative ao invés)
6. Todos podem ver tarefas de todos; apenas owner ou admin pode modificar

---

## 🧑‍💻 Desenvolvido por

**Powertec** — [@powertecdev](https://github.com/powertecdev)
**Lucas** 

---

<div align="center">

⭐ Se este projeto te ajudou, deixe uma estrela!

</div>
