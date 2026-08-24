ARG NODE_VERSION=24

# ---------- Deps stage ----------
FROM node:${NODE_VERSION}-slim AS deps

WORKDIR /frontend

RUN echo "NODE_ENV=production"

COPY frontend/ ./

# install ALL deps (dev + prod) для build
RUN npm ci --legacy-peer-deps

# --- Dev stage ---
FROM node:${NODE_VERSION}-slim  AS dev

WORKDIR /frontend

COPY frontend/ ./
RUN npm ci --legacy-peer-deps

ENV NODE_ENV=development

EXPOSE 3000

# Add aliases
COPY aliases.sh /etc/profile.d/aliases.sh

CMD ["npm", "run", "dev"]

# --- Builder stage ---
FROM node:${NODE_VERSION}-slim  AS builder
ARG NEXT_PUBLIC_CORE_API_ENTRYPOINT
ENV NEXT_PUBLIC_CORE_API_ENTRYPOINT=$NEXT_PUBLIC_CORE_API_ENTRYPOINT
ARG CORE_API_ENTRYPOINT
ENV CORE_API_ENTRYPOINT=$CORE_API_ENTRYPOINT

WORKDIR /frontend

COPY frontend/ ./
COPY --from=deps /frontend/node_modules ./node_modules

ENV NODE_ENV=production

RUN npm run build
# RUN npm run postbuild

# --- Production stage ---
FROM node:${NODE_VERSION}-slim  AS production

WORKDIR /frontend

ENV NODE_ENV=production

# only production deps
COPY frontend/ ./
RUN npm ci --omit=dev --legacy-peer-deps

# copy just the built from builder
COPY --from=builder /frontend/.next ./.next

EXPOSE 3000

CMD ["npm", "run", "start"]
