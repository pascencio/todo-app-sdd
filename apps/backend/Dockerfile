FROM node:26-alpine
RUN npm install -g corepack && corepack enable
WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile

COPY apps/backend/ ./apps/backend/
WORKDIR /app/apps/backend
CMD ["pnpm", "dev"]
