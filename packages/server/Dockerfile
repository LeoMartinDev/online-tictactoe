FROM node:14.4

WORKDIR /app
RUN chown node:node /app
USER node

COPY ./package*.json ./

RUN npm ci

COPY . .

ENV NODE_ENV=development
CMD ["npm", "run", "dev"]
