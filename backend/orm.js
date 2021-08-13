const db = require('./models/index');

/**
 * Queries the User table for the first record with the whereQuery data.
 * @param whereQuery an object with data from a potential record in the User table
 * @returns the user record from the User table as an object.
 */ 
async function findOneUser(whereQuery) {
    let userPromise = await db.User.findOne({where: whereQuery})
    .then(userRecord => {
        if (userRecord != null) {
            return userRecord;
        } else {
            return {};
        }
    });

    return await userPromise;
}

/**
 * Creates a new record in the User table based on the recordData.
 * @param data The data for the new record in the User table.
 * @returns The new user record from the User table as an object.
 */ 
async function createUser(recordData) {
    let userPromise = await db.User.create(recordData)
    .then(userRecord => {
        if (userRecord != null) {
            return userRecord;
        } else {
            return {};
        }
    });

    return await userPromise;
}

/**
 * Queries the Auth table for the first record with the whereQuery data.
 * @param whereQuery an object with data from a potential record in the Auth table
 * @returns the auth record from the Auth table as an object.
 */ 
async function findOneAuth(whereQuery) {
    let authPromise = await db.Auth.findOne({where: whereQuery})
    .then(authRecord => {
        if (authRecord != null) {
            return authRecord;
        } else {
            return {};
        }
    });

    return await authPromise;
}

/**
 * Creates a new record in the Auth table based on the recordData.
 * @param data The data for the new record in the Auth table.
 * @returns The new auth record from the Auth table as an object.
 */ 
async function createAuth(recordData) {
    let authPromise = await db.Auth.create(recordData)
    .then(authRecord => {
        if (authRecord != null) {
            return authRecord;
        } else {
            return {};
        }
    });

    return await authPromise;
}

module.exports = { findOneUser, createUser, findOneAuth, createAuth };