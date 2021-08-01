const express = require('express');
const app = express();
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@postgres:5432/postgres');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());

// Connect to Sequelize Database
(async() => { try {
  await sequelize.authenticate();
  console.log("Connection to postgressql has been established properly.");
} catch(err) {
  console.error("Cannot connect to postgressql: ", err);
}})();

const User = require('./models/user');

const userRouter = require('./routes/user');
const logoutRouter = require('./routes/logout');

app.use('/user', userRouter);
app.use('/logout', logoutRouter);

app.listen(3001, () => {
    console.log('Listening on port http://localhost:3001');
});
