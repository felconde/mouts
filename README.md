# Take-home Assignment – Desenvolvimento Fullstack com Next.js e NestJS

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
LOG_LEVEL=info
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

# Testes com cobertura
npm run test:cov
```

### Cobertura de Testes

O projeto possui testes automatizados para:

- **UserService**: Testes completos para CRUD de usuários
- **AuthService**: Testes para registro, login e validação de usuários
- **AuthController**: Testes para endpoints de autenticação
- **DTOs**: Validação de dados de entrada
- **E2E**: Testes end-to-end para APIs de usuários e autenticação

### Casos de Teste Cobertos

**Autenticação:**
- ✅ Registro de usuário com dados válidos
- ✅ Registro com email duplicado (erro)
- ✅ Login com credenciais válidas
- ✅ Login com credenciais inválidas
- ✅ Validação de usuário inativo
- ✅ Obtenção de perfil com token JWT
- ✅ Validação de DTOs (email, senha, nome)

**Usuários:**
- ✅ CRUD completo de usuários
- ✅ Cache Redis
- ✅ Tratamento de erros

## Logs

O projeto utiliza **Winston** para logs estruturados com:

- **Console**: Logs coloridos para desenvolvimento
- **Arquivos**: Logs separados por nível (error.log, combined.log)
- **Rotação**: Arquivos de log com rotação automática (5MB, 5 arquivos)
- **Estruturação**: Logs em formato JSON com timestamp e metadados

### Configuração de Logs

```bash
# Níveis de log disponíveis
LOG_LEVEL=error    # Apenas erros
LOG_LEVEL=warn     # Avisos e erros
LOG_LEVEL=info     # Informações, avisos e erros (padrão)
LOG_LEVEL=debug    # Debug, informações, avisos e erros
LOG_LEVEL=verbose  # Todos os logs
```

### Tipos de Log

- **HTTP**: Requisições e respostas com tempo de resposta
- **AUTH**: Tentativas de login, registro e validação
- **DATABASE**: Operações no banco de dados
- **CACHE**: Operações de cache (hit, miss, set, delete)
- **USER_SERVICE**: Operações CRUD de usuários

### Arquivos de Log

```
backend/
├── logs/
│   ├── error.log     # Apenas erros
│   └── combined.log  # Todos os logs
```

## Estrutura

```
├── backend/           # API NestJS
│   ├── src/auth/      # Autenticação JWT
│   ├── src/users/     # CRUD usuários
│   └── src/shared/    # Cache, database, logger
├── frontend/          # App Next.js
│   ├── src/app/       # Páginas (login, register, users)
│   ├── src/hooks/     # Hooks de autenticação
│   └── src/components/# Componentes (AuthGuard)
└── docker-compose.yml # Redis
``` 