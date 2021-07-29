#!/bin/sh

npm install
cd src
#npx sequelize-cli migration:create --name "update-users-table"
npx sequelize-cli db:migrate
cd ..
npm start