FROM node:16.19.0

WORKDIR /sdc-api

COPY . .

RUN npm install --force

EXPOSE 8080

CMD ["node", "server/index.js"]