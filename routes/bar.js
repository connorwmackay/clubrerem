const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('bar', {page_title: 'Club ReRem - Virtual Bar', page_head: 'Virtual Bar'});
});

module.exports = router;