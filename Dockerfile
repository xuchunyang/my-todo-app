FROM node:lst

RUN npm install --global pm2

WORKDIR /usr/src/app
COPY package.json .
RUN npm install --production
COPY . .

EXPOSE 4777
CMD [ "pm2-runtime", "npm", "--", "start" ]
