# Users Management System

Sistema CRUD de usuários desenvolvido com Next.js e NestJS, incluindo autenticação JWT.

## Tecnologias

**Backend (NestJS)**
- TypeORM + PostgreSQL
- Cache Redis
- Autenticação JWT
- Testes Jest
- Validação class-validator

**Frontend (Next.js)**
- React Query para cache client-side
- TypeScript
- Tailwind CSS
- Autenticação local

## Como executar

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- PostgreSQL

### 1. Configurar serviços

```bash
# Subir Redis
docker-compose up -d
```

### 2. Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar .env (veja exemplo abaixo)
# Configurar banco de dados
npm run db:setup

# Popular dados de teste
npm run db:seed

# Iniciar servidor
npm run start:dev
```

### 3. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar aplicação
npm run dev
```

## Configuração

Criar arquivo `backend/.env`:

```bash
DATABASE_URL=postgresql://usuario:senha@localhost:5432/mouts_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=mouts_super_secret_jwt_key_2024_auth
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=3001
```

## APIs

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Registra novo usuário |
| POST | `/auth/login` | Faz login |
| GET | `/auth/me` | Obtém dados do usuário logado |

### Usuários (Protegidas por JWT)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Lista usuários |
| GET | `/users/:id` | Busca usuário |
| POST | `/users` | Cria usuário |
| PUT | `/users/:id` | Atualiza usuário |
| DELETE | `/users/:id` | Remove usuário |

## Dados de Teste

Após executar `npm run db:seed`, você pode usar:

- **Email:** joao.silva@email.com
- **Senha:** 123456

## Testes

```bash
cd backend

# Testes unitários
npm run test

# Testes e2e
npm run test:e2e
```

## Estrutura

```
├── backend/           # API NestJS
│   ├── src/auth/      # Autenticação JWT
│   ├── src/users/     # CRUD usuários
│   └── src/shared/    # Cache, database
├── frontend/          # App Next.js
│   ├── src/app/       # Páginas (login, register, users)
│   ├── src/hooks/     # Hooks de autenticação
│   └── src/components/# Componentes (AuthGuard)
└── docker-compose.yml # Redis
``` 