# Docker has specific installation instructions for each operating system.
# Please refer to the official documentation at https://docker.com/get-started/

# Pull the Node.js Docker image:
# docker pull node:24-slim

# Create a Node.js container and start a Shell session:
# docker run -it --rm --entrypoint sh node:24-slim

# Verify the Node.js version:
# node -v # Should print "v24.15.0".

# Verify npm version:
# npm -v # Should print "11.12.1".

FROM node:24-slim AS base
RUN npm install -g pnpm

WORKDIR /app

# Kopieer workspace configuratie
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/database/package.json ./packages/database/
COPY packages/scraper/package.json ./packages/scraper/

# Installeer dependencies
RUN pnpm install --frozen-lockfile --filter @powned/scraper --filter @powned/database

# Kopieer broncode
COPY packages/database/ ./packages/database/
COPY packages/scraper/ ./packages/scraper/
COPY tsconfig.base.json ./

# Productie stage
FROM node:24-slim AS runner
RUN npm install -g pnpm tsx

WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages ./packages
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-workspace.yaml ./

# Omgevingsvariabelen (overschrijven met: docker run -e OPENAI_API_KEY=... )
ENV NODE_ENV=production
ENV OPENAI_API_KEY=""
ENV SUPABASE_URL=""
ENV SUPABASE_ANON_KEY=""
ENV SUPABASE_SERVICE_ROLE_KEY=""
ENV CRON_SECRET=""

CMD ["tsx", "packages/scraper/src/index.ts"]
