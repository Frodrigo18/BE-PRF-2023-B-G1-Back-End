FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD node mongo/startup.js && npm start