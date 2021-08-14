const express = require('express');
const router = express.Router();
const { hashPassword, isPasswordCorrect, hashDivider, getRandomAuthKey, hashPasswordWithSalt } = require('../scripts/password');
const { findOneUser, createUser, findOneAuth, createAuth } = require('../orm');

router.post('/me', async(req, res) => {
    const authKey = req.body.authKey;
    const salt = req.body.salt;

    // Default resonse return values.
    let isAuthenticated = false;
    let username = "";

    function isDefined(variable) {
        if (variable == undefined || variable == '' || variable == null || variable == 'undefined') {
            return false;
        } else {
            return true;
        }
    }

    if (!isDefined(authKey) || !isDefined(salt)) {

    } else {
        const hash = hashPasswordWithSalt(authKey, salt);
        const hashArr = hash + hashDivider + salt;

        let dbHash = [];

        let authRecord;
        await findOneAuth({key_hash: hashArr})
            .then(auth => authRecord = auth.dataValues)
            .catch(err => {
                console.error(err);
                authRecord = {};
            });

        if (authRecord != {}) {
            dbHash = authRecord.key_hash.split(hashDivider);
        }

        if (isPasswordCorrect(authKey, dbHash[0], salt)) {
            const userId = authRecord.user_id;

            let userRecord;
            await findOneUser({ id: userId })
                .then(user => userRecord = user.dataValues)
                .catch(err => {
                    console.error(err);
                });

            if (userRecord != {}) {
                username = userRecord.username;
            }

            isAuthenticated = true;
        }
    }

    res.status(201);
    res.json({
        isAuthenticated: isAuthenticated,
        username: username
    });
});

router.post('/validate', async(req, res) => {
    const username  = req.body.username;
    const password  = req.body.password;

    // Default response values
    let response = {
        isValidLogin: false,
        status: "Incorrect login details",
        authKey: "",
        salt: ""
    };

    if (username != "" || username != null &&
        password != "" || password != null) {

        let userRecord;
        await findOneUser({ username: username })
        .then(user => userRecord = user.dataValues)
        .catch(err => {
            console.error(err);
            userRecord = {};
        });

        if (userRecord != {}) {
            const hashSplit = userRecord.password_hash.split(hashDivider);
            const salt = hashSplit[1];

            if (isPasswordCorrect(password, hashSplit[0], salt)) {
                const userId = userRecord.id;
                const authKey = getRandomAuthKey();
                const authHash = hashPassword(authKey);

                let authRecord;
                await createAuth({key_hash: authHash[0] + hashDivider + authHash[1], user_id: userId})
                .then(auth => authRecord = auth.dataValues)
                .catch(err => {
                    console.error(err);
                    authRecord = {};
                });

                if (authRecord != {}) {
                    response.isValidLogin = true;
                    response.status = `Successfully logged in as ${username}`;
                    response.authKey = authKey;
                    response.salt = authHash[1];
                }
            }
        }
    }

    res.json({
        isValidLogin: response.isValidLogin,
        status: response.status,
        authKey: response.authKey,
        salt: response.salt,
    });
});

router.post('/create', async(req, res) => {
    const username  = req.body.username;
    const email = req.body.email_addr;
    const password = req.body.password;

    let response = {
        isSuccessful: false,
        status: "",
        username: ""
    };

    if (username != null && email != null && password != null) {
        const hashArray = hashPassword(password);
        const passwordSalt = hashArray[0] + hashDivider + hashArray[1];
        
        let userExistsRecord;
        await findOneUser({ username: username })
        .then(user => userExistsRecord = user.dataValues)
        .catch(err => {
            console.error(err);
            userExistsRecord == {};
        });

        if (userExistsRecord != {}) {
            let userRecord;
            await createUser({username: username, email: email, password_hash: passwordSalt})
            .then(user => userRecord = user.dataValues)
            .catch(err => {
                console.error(err);
                userRecord = {};
            });


            if (userRecord != {}) {
                response.isSuccessful = true;
                response.status = `Created new user ${username}`;
                response.username = username;
            } else {
                response.status = "Could not create username";
            }
        } else {
            response.status = "User already exists";
        }
    } else {
        response.status = "Details not sufficient to create user";
    }

    res.json({
        isSuccessful: response.isSuccessful,
        status: response.status,
        username: response.username
    });
});

module.exports = router;