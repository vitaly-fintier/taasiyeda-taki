FROM node:10

RUN mkdir -p /srv
WORKDIR /srv
ADD . /srv

RUN cd /srv && npm install

CMD ["node", "/srv/server/server.js"]
