const { UserModel } = require("../models/User");

const { validateHashData } = require("../services/AuthServices");

// Middleware to confirm fields for sign-up meet requirements (work in progress)
const checkUserFields = (request, response, next) => {
    const {email, password, firstName, lastName, userName} = request.body;

    if (!email || !password || !firstName || !lastName || !userName){
        let error = new Error("Missing fields");
        error.statusCode = 400;
        next(error);
    }

    next();
}

// Checks email format against regular expression, 
// returns a true or false, runs if statement to check if email is valid
// Checks database for user related to email, 
// if an email already exists throws error.
// Regular expression provided from Email Validation: Regex & JavaScript
// https://www.abstractapi.com/guides/email-validation-regex-javascript Author Elizabeth Shipton Aug 03 2023
const checkValidEmail = async (request, response, next) => {
    const regEx = 
        new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");
    const isValidEmail = regEx.test(request.body.email);

    if (!isValidEmail){
        let error = new Error("Incorrect Email format");
        error.statusCode = 400;
        next(error);
    }

    let savedUserEmail = await UserModel.findOne({email: request.body.email}).exec();
    if (savedUserEmail) {
        let error = new Error("Email already in use");
        error.statusCode = 400;
        next(error);
    }

    next();
}

// Checks database for user with associated username,
// Throws error if user exists
const checkValidUsername = async (request, response, next) => {
    let savedUserName = await UserModel.findOne({userName: request.body.userName}).exec();
    if (savedUserName) {
        let error = new Error("Username already in use");
        error.statusCode = 400;
        next(error);
    }

    next();
}

// Login specific middleware,
// Checks request body email matches with user email within database
// Checks request body password matches with stored password, 
// using bcrypt compare method
// If all tests pass, middleware is complete and continues to next step in chain
// If a check fails then error is passed through to error handling middleware.
const loginMiddleware = async (request, response, next) => {
    const savedUser = await UserModel.findOne({email: request.body.email});
    if (!savedUser){
        let error = new Error("Incorrect email, try again");
        error.statusCode = 400;
        next(error);
    } else {
        let validPassword = await validateHashData(request.body.password, savedUser.password);
        if (!validPassword){
            let error = new Error("Incorrect password, try again");
            error.statusCode = 400;
            next(error);
        }
        next();
    }
}


module.exports = {
    checkUserFields,
    checkValidEmail,
    checkValidUsername,
    loginMiddleware
}