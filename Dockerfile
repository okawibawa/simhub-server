FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN yarn

COPY . .

RUN yarn start

EXPOSE 8000

CMD [ "yarn", "start" ]
