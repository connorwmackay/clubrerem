const express = require('express');
const router = express.Router();

const { hashPassword, isPasswordCorrect, hashDivider } = require('../scripts/password');
const db = require('../models/index');

router.get('/', (req, res) => {
  res.render('signup', {page_title: 'Club ReRem - Sign Up', page_head: 'Sign Up'});
});

router.post('/', (req, res) => {
  /* TODO: validation logic on server-side */
  const username  = req.body.username;
  const email = req.body.email_addr;
  const password = req.body.password;

  if (username != null && email != null && password != null) {
    const hashArray = hashPassword(password);
    const passwordSalt = hashArray[0] + hashDivider + hashArray[1];

    console.log("Username: ", username);
    console.log("Email: ", email);
    console.log("Password: ", passwordSalt);

    const newUser = (async() => { try {
        await db.User.create({username: username, email: email, password_hash: passwordSalt})
        console.log("User ID: ", newUser.id);
        res.status(201);
        res.redirect("/");
      } catch(err) {
        console.log("Could not create user: ", err);
        res.status(500);
        res.send("Post request unsuccessful."); // TODO: Redirect to a 500 page route i.e. /error-505
      }
    })();
  } else {
    res.status(500);
    res.send("Post request unsuccessful."); // TODO: Redirect to a 500 page route i.e. /error-505
  }
});

module.exports = router;
