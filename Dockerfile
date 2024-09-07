FROM node:22.1.0-alpine AS development

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6 yarn install --frozen-lockfile
COPY --chown=node:node . .

USER node

FROM node:22.1.0-alpine AS build

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6 yarn install --frozen-lockfile --production

USER node

FROM node:22.1.0-alpine

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/.env ./.env

CMD [ "node", "dist/main.js" ]
