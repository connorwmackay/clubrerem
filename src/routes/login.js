const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', {page_title: 'Club ReRem - Login', page_head: 'Login'});
});

module.exports = router;