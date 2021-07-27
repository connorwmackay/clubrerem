const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'))

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