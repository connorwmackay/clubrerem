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

/**
 * Queries the Room table for the first record with the whereQuery data.
 * @param whereQuery an object with data from a potential record in the Room table
 * @returns the room record from the Room table as an object.
 */ 
 async function findOneRoom(whereQuery) {
    let roomPromise = await db.Room.findOne({where: whereQuery})
    .then(roomRecord => {
        if (roomRecord != null) {
            return roomRecord;
        } else {
            return {};
        }
    });

    return await roomPromise;
}

/**
 * Queries the Room table for all records with the whereQuery data.
 * @param whereQuery an object with data from a potential record in the Room table
 * @returns the room records from the Room table as an object.
 */ 
 async function findAllRooms(whereQuery) {
    let roomPromise = await db.Room.findAll({where: whereQuery})
    .then(roomRecord => {
        if (roomRecord != null) {
            return roomRecord;
        } else {
            return {};
        }
    });

    return await roomPromise;
}

/**
 * Creates a new record in the Room table based on the recordData.
 * @param data The data for the new record in the Room table.
 * @returns The new room record from the Room table as an object.
 */ 
async function createRoom(recordData) {
    let roomPromise = await db.Room.create(recordData)
    .then(roomRecord => {
        if (roomRecord != null) {
            return roomRecord;
        } else {
            return {};
        }
    });

    return await roomPromise;
}

/**
 * Updates a record in the Room table based on the recordData.
 * @param data The data for the new record in the Room table.
 * @param whereQuery an object with data from a potential record in the Room table
 * @returns The new room record from the Room table as an object.
 */ 
 async function updateRoom(recordData, whereQuery) {
    let roomPromise = await db.Room.update(recordData, {where: whereQuery})
    .then(roomRecord => {
        if (roomRecord != null) {
            return roomRecord;
        } else {
            return {};
        }
    });

    return await roomPromise;
}

async function findOneRoomMember(whereQuery) {
    let roomMemberPromise = await db.RoomMember.findOne({where: whereQuery})
    .then(roomMemberRecord => {
        if (roomMemberRecord != null) {
            return roomMemberRecord;
        } else {
            return {};
        }
    });

    return await roomMemberPromise;
}

async function findAllRoomMembers(whereQuery) {
    let roomMemberPromise = await db.RoomMember.findAll({where: whereQuery})
    .then(roomMemberRecord => {
        if (roomMemberRecord != null) {
            return roomMemberRecord;
        } else {
            return {};
        }
    });

    return await roomMemberPromise;
}

/**
 * Creates a new record in the Room table based on the recordData.
 * @param data The data for the new record in the Room table.
 * @returns The new room record from the Room table as an object.
 */ 
async function createRoomMember(recordData) {
    let roomMemberPromise = await db.RoomMember.create(recordData)
    .then(roomMemberRecord => {
        if (roomRecord != null) {
            return roomMemberRecord;
        } else {
            return {};
        }
    });

    return await roomMemberPromise;
}

module.exports = { findOneUser, createUser, findOneAuth, createAuth, findOneRoom, findAllRooms, createRoom, updateRoom, findOneRoomMember,findAllRoomMembers, createRoomMember };