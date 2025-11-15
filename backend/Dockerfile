# stage 1: build the application
FROM node:22.21.1-alpine3.21 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# stage 2: run the application
FROM node:22.21.1-alpine3.21

WORKDIR /app

COPY --from=build /app /app

EXPOSE 3001

ENTRYPOINT ["node", "server.js"]
