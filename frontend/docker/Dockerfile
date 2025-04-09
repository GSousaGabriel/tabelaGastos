FROM node:slim AS base

FROM base AS deps

WORKDIR /app

COPY *.json .
RUN npm ci

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]