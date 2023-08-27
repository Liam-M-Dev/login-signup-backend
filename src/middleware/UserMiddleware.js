const { UserModel } = require("../models/User");

const { validateHashData } = require("../services/AuthServices");

const checkUserFields = async (request, response, next) => {
    const {email, password} = request.body;

    if (!email || !password){
        let error = new Error({message: "Missing password or email"});
        error.statusCode = 400
        next(error)
    }

    next()

}

const checkValidEmail = async (request, response, next) => {
    const savedUser = await UserModel.findOne({email: request.body.email});
    if (!savedUser){
        let error = new Error({message: "Incorrect email, try again"});
        error.statusCode = 400
        next(error)
    }
    
    next();
}