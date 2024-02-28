FROM node:20.11.1-alpine3.19

WORKDIR /app

COPY ./ /app

RUN npm install

RUN apk add --update docker openrc
RUN rc-update add docker boot

RUN docker --version 

CMD ["node", "app.js"]