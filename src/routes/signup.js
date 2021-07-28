const express = require('express');
const router = express.Router();

const UsersModel = require('../models/users');

router.get('/', (req, res) => {
  res.render('signup', {page_title: 'Club ReRem - Sign Up', page_head: 'Sign Up'});
});

router.post('/', (req, res) => {
  const username = req.body.username;
  const email = req.body.email_addr;
  const password = req.body.password;

  console.log(username);
  console.log(email);
  console.log(password);

  (async() => {
    try {
      const user = await UsersModel.create({
        username: username,
        email: email,
        passwordSalt: password
      });
      console.log(JSON.stringify(user));  
    } catch (err) {
      res.send("Could not create user", err);
    }
  });
});

module.exports = router;