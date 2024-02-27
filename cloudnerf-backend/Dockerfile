FROM node:20.11-bullseye-slim

WORKDIR /app

COPY ./ /app

RUN npm install

RUN curl -fsSL https://get.docker.com | sh

CMD ["node", "app.js"]