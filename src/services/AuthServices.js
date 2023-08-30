const bcrypt = require("bcrypt");

const dotenv = require("dotenv");
dotenv.config();

// Create functions for bcrypt password hashing and verification
const saltRounds = 10;

async function hashString(stringToHash){
    let addSalt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(stringToHash, addSalt);
}

async function validateHashData(unhashedData, storedHashedData){
    return await bcrypt.compare(unhashedData, storedHashedData);
}


module.exports = {
    hashString,
    validateHashData
}