# Blogging Platform 📝

A full-featured, scalable blogging platform built using a monorepo architecture powered by Turborepo. Includes real-time collaboration, LLM-enhanced capabilities, AWS support, and clean code organization.

---

## 🔧 Tech Stack

- **Frontend**: Next.js (Bun runtime)
- **Backend**: Express.js (REST API)
- **Realtime**: Socket.IO
- **AI Integration**: LLM routes
- **Storage**: AWS (S3)
- **Monorepo Tooling**: Turborepo
- **Package Manager**: Bun 

---

## 📁 Monorepo Structure

```bash
blogging-platform/
├── apps/
│   ├── backend/          # Express API with multiple route files
│   ├── frontend/         # Frontend app (Next.js)
│   ├── docs/             # Documentation site (under development)
│   ├── socket-server/    # Socket.IO server
├── packages/             # Shared utilities / config (Prisma Setup)
├── package.json          # Root-level script and dependency manager
├── turbo.json            # Turborepo configuration
├── bun.lock              # Bun lockfile
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/iyush05/blogging-platform.git
cd blogging-platform
```

### 2. Install dependencies

Using **Bun** (preferred):

```bash
bun install
```

Or fallback to **npm**:

```bash
npm install
```

### 3. Start All Services

Make sure you run the backend, frontend, and socket server individually or via Turborepo.

```bash
# Backend
cd apps/backend
bun index.ts 

# Frontend
cd apps/frontend
bun next dev

# Socket Server
cd apps/socket-server
bun index.ts
```

---

## 🌐 API Overview

`apps/backend/` folder includes several route files:

| Route File              | Description                     |
|-------------------------|---------------------------------|
| `authRoutes.ts`         | Handles user authentication     |
| `blogRoutes.ts`         | Create, update, delete blogs    |
| `awsRoutes.ts`          | AWS file upload/download logic  |
| `llmRoutes.ts`          | AI/LLM-based text processing    |
| `connectionRoutes.ts`   | Follows/connect-style logic     |
| `middleware.ts`         | Auth middleware or other logic  |

---

## ⚡ Socket Server

The Socket.IO server in `apps/socket-server/` handles real-time events such as live updates, chat, etc.

Run it with:

```bash
bun index.ts
```

---

## 🌍 Environment Variables

Create a `.env` file at the root of each `apps/*` directory based on required environment variables.

You can use a structure like:

```bash
# .env.example

DATABASE_URL=postgres://user:password@localhost:5432
AWS_ACCESS_KEY=...
AWS_SECRET_KEY=...
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_BACKEND_URL=http://localhost:9090
```

---

## 📦 Scripts

You can use `turbo` to run tasks across all packages:

```bash
npx turbo run dev --filter=frontend
npx turbo run dev --filter=backend
```

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/xyz`
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License © Ayush Kannaujiya