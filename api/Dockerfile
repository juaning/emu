FROM node:9

FROM node:9
WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet

RUN npm install -g typescript ts-node

COPY . .