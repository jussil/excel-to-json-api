FROM node:9-alpine
LABEL maintainer="Jussi Lindfors"

COPY app.js package.json /app/

WORKDIR /app

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
