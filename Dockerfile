FROM node:8.1.2-alpine
COPY app /usr/src/app

RUN cd /usr/src/app && npm install

CMD node /usr/src/app/app.js
