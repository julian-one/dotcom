FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

ENV PORT 3000

EXPOSE $PORT

CMD [ "npm", "start" ]
