FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm run install

COPY . .

RUN npm run build

EXPOSE 8000

CMD [ "yarn", "start" ]
