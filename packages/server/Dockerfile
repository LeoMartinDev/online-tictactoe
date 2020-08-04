FROM node:14.4 as install

WORKDIR /app
RUN chown node:node /app
USER node

COPY ./package*.json ./

ARG NODE_ENV=production
RUN npm ci

COPY . .

FROM install as development

ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

FROM install as production

CMD ["npm", "start"]