const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'))

// TODO: Give each route their own JS file instead of being put in app.js
app.get('/', (req, res) => {
    res.render('index', {page_title: 'Club ReRem', page_head: 'Club ReRem'});
});

app.get('/bar', (req, res) => {
    res.render('bar', {page_title: 'Club ReRem - Virtual Bar', page_head: 'Virtual Bar'});
});

app.listen(3000, () => {
    console.log('Listening on port http://localhost:3000');
});