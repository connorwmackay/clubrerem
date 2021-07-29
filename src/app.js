const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', 'src/views');
app.use(express.static('./src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sequelize = require('./db');

const indexRouter = require('./routes/index');
const barRouter = require('./routes/bar');
const roomRouter = require('./routes/room');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');

app.use('/', indexRouter);
app.use('/bar', barRouter);
app.use('/room', roomRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);

app.listen(3000, () => {
    console.log('Listening on port http://localhost:3000');
});
