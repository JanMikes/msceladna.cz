FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY ./package.json ./package-lock.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]
