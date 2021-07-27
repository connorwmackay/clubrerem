const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {page_title: 'Club ReRem', page_head: 'Club ReRem'});
});

module.exports = router;