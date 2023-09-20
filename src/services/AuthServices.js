const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

// ---- encryption and decryption ----

let encAlgorithm = "aes-256-cbc";
let encPrivateKey = crypto.scryptSync(process.env.ENC_KEY, "SpecialSalt", 32);
let encIV = crypto.scryptSync(process.env.ENC_IV, "SpecialSalt", 16);
let cipher = crypto.createCipheriv(encAlgorithm, encPrivateKey, encIV);
let decipher = crypto.createDecipheriv(encAlgorithm, encPrivateKey, encIV);



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