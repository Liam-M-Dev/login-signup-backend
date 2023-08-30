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

const checkValidEmailOrUsername = async (request, response, next) => {
    let savedUser = await UserModel.findOne({email: request.body.email}).exec();
    if (savedUser) {
        let error = new Error("Email already in use");
        error.statusCode = 400;
        next(error);
    }
    
    savedUser = await UserModel.findOne({userName: request.body.userName}).exec();
    if (savedUser) {
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
    checkValidEmailOrUsername,
    loginMiddleware
}