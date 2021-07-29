const express = require('express');
const router = express.Router();
const { hashPassword, isPasswordCorrect, hashDivider } = require('../scripts/password');
const db = require('../models/index');

router.get('/', (req, res) => {
  res.render('login', {page_title: 'Club ReRem - Login', page_head: 'Login'});
});

router.post('/', (req, res) => {
  const username  = req.body.username;
  const password  = req.body.password;

  if (username != null && password != null) {

    // GET data from database
    const user = (async() => {return await db.User.findOne({
      where: {
        username: username // TODO: Add new migration making username column unique
      }
    });})().then(user => {
      // console.log("User: ", user);

      const hashSplit = user.dataValues.password_hash.split(hashDivider);
      // console.log(hashSplit);
      const salt = hashSplit[1];

      if (isPasswordCorrect(password, hashSplit[0], salt)) {
        res.status(201);
        res.redirect('/');
      } else {
        // Password incorrect.
        res.status(500);
        res.send("Incorrect password.");
      }
    }).catch((err) => {
      console.log(err);
      res.status(500);
      res.send("User could not be found.");
    });
  }
  
});

module.exports = router;