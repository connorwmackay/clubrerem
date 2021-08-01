FROM node:14-alpine
ENV NODE_ENV=development
WORKDIR /usr/src/app/backend
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .