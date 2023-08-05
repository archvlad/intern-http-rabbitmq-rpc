FROM node:19
WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci --omit=dev
COPY src .
CMD ["node", "server.js"]