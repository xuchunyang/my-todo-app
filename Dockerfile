FROM node:lts
ENV NODE_ENV=production

RUN npm install --global pm2

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 4777

CMD [ "pm2-runtime", "npm", "--", "start" ]
