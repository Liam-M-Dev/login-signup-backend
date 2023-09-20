// Import user model
const {UserModel} = require("../models/User");
const { hashString, generateUserJWT } = require("../services/AuthServices");

// Basic function to get all users
// Returns list of users for development purposes, will remove at later date
const getAllUsers = async (request, response) => {
    try {
        const userList = await UserModel.find({}).exec();

        response.json(userList);
    } catch (error) {
        console.log(`Error occurred: \n ${error.message}`);
    }    
}

// Function to return a single user from database
// Intended data to be exposed for client side will be username
const getUserById = async (request, response) => {
    try {
        const savedUser = await UserModel.find({id: request.body.id}).exec();
        
        if (savedUser) {
            response.json({userName: savedUser.userName});
        } else {
            response.status(404).json({message: "No user found in database"});
        }

    } catch (error) {
        console.log(error.message);
        response.status(400).json({message: "Error occurred!"})
    }
}

// function to login user takes request data and confirms user exists in database,
// validation checks run through middleware.
// Returns welcome message with JWT return to be implemented
const loginUser = async (request, response) => {
    try {
        let savedUser = await UserModel.findOne({email: request.body.email}).exec();

        let token = generateUserJWT({
            userId: savedUser.id,
            userName: savedUser.userName
        })
        
        response.status(200)
        .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })
        .json({message: `welcome ${savedUser.userName}!`});
    } catch (error) {
        console.log(error)
        response.status(404).json({message: "User not found", error: error.message});
    }
}

// Takes request information and creates a new user profile.
// Stores user in database and returns success response and
// authentication response.
const userCreation = (async (request, response) => {
    try {

        let hashedPassword = await hashString(request.body.password)

        const newUser = {
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            userName: request.body.userName,
            password: hashedPassword
        }

        let userSaved = new UserModel(newUser);
        await userSaved.save();
        console.log(userSaved);
        
        let token = generateUserJWT({
            userId: userSaved.id,
            userName: userSaved.userName
        })
        response.status(200)
        .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })
        .json({
            message: "User saved successfully"
        });

    } catch (error) {
        console.log(error);
        response.status(400).json({
            message: "Error occurred whilst saving user"
        })
    }
})


module.exports = {
    getAllUsers,
    getUserById,
    loginUser,
    userCreation
}