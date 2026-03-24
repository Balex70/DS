ARG NODE_VERSION=24

# ---------- Base stage for development ----------
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /web

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps

ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Add aliases
ADD aliases.sh /etc/profile.d/aliases.sh

# --- Production stage ---
FROM base AS dev

ENV NODE_ENV=development

# tail -f /dev/null the Node.js process does not start at all, so the queue is ignored
# CMD ["tail", "-f", "/dev/null"]
CMD ["npm", "run", "dev"]

# --- Production stage ---
FROM base AS production

ENV NODE_ENV=production

# Run the build step during image build
RUN npm run build

# Generate sitemap.xml and robots.txt using next-sitemap ("postbuild": "next-sitemap --config next-sitemap.config.cjs")
# RUN npm run postbuild

CMD ["npm", "run", "start"]
