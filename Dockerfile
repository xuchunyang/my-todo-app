FROM node:lts
ENV NODE_ENV=production

RUN apt-get update --quiet
RUN apt-get install --assume-yes sqlite3

RUN npm install --global pm2

WORKDIR /app

COPY package.json .
RUN npm install

COPY createdb.sql .
RUN sqlite3 my-todo-app.sqlite <createdb.sql

COPY . .

EXPOSE 4777

CMD [ "pm2-runtime", "npm", "--", "start" ]
