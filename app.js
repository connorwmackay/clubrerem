const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'))

const indexRouter = require('./routes/index');
const barRouter = require('./routes/bar');

app.use('/', indexRouter);
app.use('/bar', barRouter);

app.listen(3000, () => {
    console.log('Listening on port http://localhost:3000');
});