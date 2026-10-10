FROM node:24-alpine AS build
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/algorithms/package.json packages/algorithms/
COPY packages/contracts/package.json packages/contracts/
COPY packages/stats/package.json packages/stats/
COPY packages/tnoodle-lib-rs/package.json packages/tnoodle-lib-rs/
COPY services/api/package.json services/api/
RUN pnpm install --frozen-lockfile --ignore-scripts --filter @nexustimer/api...
COPY packages/algorithms packages/algorithms
COPY packages/contracts packages/contracts
COPY packages/stats packages/stats
COPY packages/tnoodle-lib-rs packages/tnoodle-lib-rs
COPY services/api services/api
RUN pnpm --filter @nexustimer/api build

FROM node:24-alpine
ENV NODE_ENV=production PORT=8000
WORKDIR /app
COPY --from=build /repo/services/api/dist ./dist
USER node
EXPOSE 8000
CMD ["node", "--enable-source-maps", "dist/main.js"]
