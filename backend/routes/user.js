const express = require('express');
const router = express.Router();
const { hashPassword, isPasswordCorrect, hashDivider, getRandomAuthKey, hashPasswordWithSalt } = require('../scripts/password');
const db = require('../models/index');

router.post('/me', (req, res) => {
   const authKey = req.body.authKey;
   const salt = req.body.salt;
   const hash = hashPasswordWithSalt(authKey, salt);
   const hashArr = hash + hashDivider + salt;

    db.Auth.findOne({
        where: {
            key_hash: hashArr
        }
    }).then(auth => {
        if (auth) {
            const userId = auth.dataValues.user_id;
            const dbHash = auth.dataValues.key_hash.split(hashDivider);

            if (isPasswordCorrect(authKey, dbHash[0], salt)) {
                db.User.findOne({
                    where: {
                        id: userId
                    }
                }).then((user) => {
                    if (user) {
                        res.status(201);
                        res.json({
                            isAuthenticated: true,
                            username: user.dataValues.username
                        })
                    } else {
                        res.status(201);
                        res.json({isAuthenticated: false});
                    }
                });
            } else {
                res.status(201);
                res.json({isAuthenticated: false});
            }
        } else {
            res.status(201);
            res.json({isAuthenticated: false});
        }
    })
});

router.post('/validate', (req, res) => {
    const username  = req.body.username;
    const password  = req.body.password;

    if (username != null && password != null) {
        db.User.findOne({
            where: {
            username: username
            }
        }).then(user => {
            if (user) {
                const hashSplit = user.dataValues.password_hash.split(hashDivider);
                const salt = hashSplit[1];

                if (isPasswordCorrect(password, hashSplit[0], salt)) {
                    res.status(201);

                    const userId = user.dataValues.id;
                    const authKey = getRandomAuthKey();
                    const hash = hashPassword(authKey);

                    // Perform an insert into the Auth table.
                    db.Auth.create({
                        key_hash: hash[0] + hashDivider + hash[1],
                        user_id: userId
                    }).then(() => {
                        res.json({
                            isValidLogin: true,
                            status: "Successfully logged in as " + username,
                            authKey: authKey,
                            salt: hash[1],
                        });
                    }).catch((err) => {
                        console.error("Error: ", err);
                    });
                } else {
                    res.status(201);
                    res.send({isValidLogin: false, status: "Incorrect login details"});
                }
            } else {
                res.status(201);
                res.json({isValidLogin: false, status: "Incorrect login details"});
            }

        }).catch((err) => {
            console.log(err);
            res.status(500);
            res.json({isValidLogin: false, status: "Incorrect login details"});
        });
    } else {
        res.status(201);
        res.json({isValidLogin: false, status: "Incorrect login details"});
    }
});

router.post('/create', (req, res) => {
    const username  = req.body.username;
    const email = req.body.email_addr;
    const password = req.body.password;

    if (username != null && email != null && password != null) {
        const hashArray = hashPassword(password);
        const passwordSalt = hashArray[0] + hashDivider + hashArray[1];
        db.User.create({username: username, email: email, password_hash: passwordSalt}).then(() => {
            res.status(201);
            res.json({isSuccessful: true, username: username, status: "Created new user '" + username + "'"});
        }).catch((err) =>{
            console.log("Could not create user: ", err);
            res.status(500);
            res.json({isSuccessful: false, status: "Could not create user"});
        });
      } else {
        res.status(500);
        res.json({isSuccessful: false, status: "Details not sufficient to create user"});
      }
});

router.get('/:username', (req, res) => {
    res.json({});
});

module.exports = router;