FROM node:8.1.2-alpine
COPY app /usr/src/app

RUN cd /usr/src/app && npm install --production

ENV MOPIDYURL localhost
ENV MOPIDYPORT 8080

CMD node /usr/src/app/app.js
