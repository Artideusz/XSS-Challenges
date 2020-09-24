FROM node:14.9

WORKDIR /opt/server

COPY . .

RUN npm i

EXPOSE 8080

ENTRYPOINT ["npm", "start"]