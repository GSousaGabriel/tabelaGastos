FROM node:slim AS base

FROM base AS deps

WORKDIR /app

COPY package.json .
RUN npm i

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]