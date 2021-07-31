const express = require('express');
const app = express();
const session = require('express-session');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@postgres:5432/postgres');
var cookieParser = require('cookie-parser');

app.set('view engine', 'pug');
app.set('views', 'src/views');
app.use(express.static('./src/public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Connect to Sequelize Database
(async() => { try {
  await sequelize.authenticate();
  console.log("Connection to postgressql has been established properly.");
} catch(err) {
  console.error("Cannot connect to postgressql: ", err);
}})();

const sequelizeStore = new require("connect-session-sequelize")(session.Store);

// User Sessions
app.use(session({
    secret: process.env.COOKIE_SECRET,
    store: new sequelizeStore ({
        db: sequelize
    }),
    resave: false,
    saveUninitialized: false,
}));

const User = require('./models/user');

const indexRouter = require('./routes/index');
const barRouter = require('./routes/bar');
const roomRouter = require('./routes/room');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const logoutRouter = require('./routes/logout');
const errorRouter = require('./routes/error');

app.use('/', indexRouter);
app.use('/bar', barRouter);
app.use('/room', roomRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/logout', logoutRouter);
app.use('/error', errorRouter);

app.listen(3000, () => {
    console.log('Listening on port http://localhost:3000');
});
