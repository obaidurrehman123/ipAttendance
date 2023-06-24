FROM node:18-alpine

RUN apk add --no-cache postgresql-client


WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install


COPY . .


EXPOSE 4000


CMD ["npm", "run", "server"]



