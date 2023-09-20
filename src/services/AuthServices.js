const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
const { UserModel } = require("../models/User");
dotenv.config();

// ---- encryption and decryption ----
// Code followed by steps provided via EdLessons with Coder Academy 

let encAlgorithm = "aes-256-cbc";
let encPrivateKey = crypto.scryptSync(process.env.ENC_KEY, "SpecialSalt", 32);
let encIV = crypto.scryptSync(process.env.ENC_IV, "SpecialSalt", 16);
let cipher = crypto.createCipheriv(encAlgorithm, encPrivateKey, encIV);
let decipher = crypto.createDecipheriv(encAlgorithm, encPrivateKey, encIV);

// convert string to encrypted string
function encryptString(data){
    cipher = crypto.createCipheriv(encAlgorithm, encPrivateKey, encIV);
    return cipher.update(data, "utf8", "hex") + cipher.final("hex");
}

// convert encrypted string to plaintext string
function decryptString(data){
    decipher = crypto.createDecipheriv(encAlgorithm, encPrivateKey, encIV);
    return decipher.update(data, "hex", "utf8") + decipher.final("utf8");
}

// Assumes an encrypted string is an object
function decryptObject(data){
    return JSON.parse(decryptString(data));
}


// ----- Bcrypt password hashing and verification -----
const saltRounds = 10;

async function hashString(stringToHash){
    let addSalt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(stringToHash, addSalt);
}

async function validateHashData(unhashedData, storedHashedData){
    return await bcrypt.compare(unhashedData, storedHashedData);
}

// ------ JWT Functionality ------
function generateJWT(payloadObj){
    return jwt.sign(payloadObj, process.env.JWT_SECRET, {expiresIn: "2d"});
}

function generateUserJWT(userDetails){
    let encryptedData = encryptString(JSON.stringify(userDetails));
    return generateJWT({data: encryptedData});
}

async function verifyUserJWT(userJWT){
    let userJwtVerified = jwt.verify(userJWT, process.env.JWT_SECRET, {complete: true});
    let decryptedPayload = decryptString(userJwtVerified.payload.data);
    let userData = JSON.parse(decryptedPayload);
    let targetUser = await UserModel.findById(userData.userID).exec();

    if (targetUser){
        return generateUserJWT({data: userJwtVerified.payload.data});
    } else {
        let error = new Error("Invalid Access");
        error.statusCode = 401;
        return error
    }
}


module.exports = {
    hashString,
    validateHashData,
    generateUserJWT,
    verifyUserJWT,
    decryptObject
}