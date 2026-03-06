FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
RUN apk add --no-cache python3 make g++ pkgconfig
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/widget/package.json ./packages/widget/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm --filter ./packages/widget build \
  && mkdir -p public/widget \
  && cp -r packages/widget/dist/. public/widget/ \
  && pnpm build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
