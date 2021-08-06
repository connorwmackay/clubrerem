const express = require('express');
const db = require('../models/index');
const {hashPasswordWithSalt, hashDivider, isPasswordCorrect} = require("../scripts/password");

function isAuthenticated(authKey, salt) {
    let isAuth = false;

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
                        isAuth = true;
                    } else {
                        isAuth = false;
                    }
                });
            } else {
                isAuth = false;
            }
        } else {
            isAuth = false;
        }
    })

    return isAuth;
}

function isAuthenticatedRetUser(authKey, salt) {
    let authRet = {
        isAuth: false,
        userId: null
    };

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
                        authRet.isAuth = true;
                        authRet.userId = userId;
                    } else {
                        authRet.isAuth = false;
                    }
                });
            } else {
                authRet.isAuth = false;
            }
        } else {
            authRet.isAuth = false;
        }
    })

    return authRet;
}

function isValidMember(authKey, salt, roomCode) {
    let auth = isAuthenticatedRetUser(authKey, salt);

    if (auth.isAuth) {
        db.Room.findOne({
            where: {
                code: roomCode
            }
        }).then(() => {
            if (room) {
                const roomId = room.dataValues.room_id;
                const userId = auth.userId;

                db.RoomMember.findOne({
                    where: {
                        room_id: roomId,
                        user_id: userId
                    }
                }).then(member => {
                    if (member != null || member != undefined) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        });
    }

    return false;
}

module.exports = {isAuthenticated, isAuthenticatedRetUser, isValidMember};