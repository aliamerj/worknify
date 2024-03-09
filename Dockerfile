ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-alpine as base

# Update npm to specific version
RUN npm install -g npm@10.5.0

WORKDIR /usr/src/app
EXPOSE 3000

FROM base as dev
ENV APP_ENV dev
RUN apk add --no-cache python3 make g++
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
COPY . .
CMD npm run dev

FROM base as prod
ENV APP_ENV prod
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
COPY . .
RUN npm run build
CMD npm run start 

FROM base as test
ENV APP_ENV test
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
COPY . .
RUN npm run test
