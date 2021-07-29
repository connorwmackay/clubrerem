#!/bin/sh

npm install
cd src
npx sequelize-cli db:migrate
cd ..
npm start