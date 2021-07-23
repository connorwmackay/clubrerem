const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'))

// TODO: Give each route their own JS file instead of being put in app.js
app.get('/', (req, res) => {
    res.render('index', {page_title: 'Club ReRem', page_name: 'Club ReRem'});
});

app.listen(3000, () => {
    console.log('Listening on port http://localhost:3000');
});