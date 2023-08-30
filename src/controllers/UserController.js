// Import user model
const {UserModel} = require("../models/User");

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

// function to login user takes request data and confirms user exists in database,
// validation checks run through middleware.
// Returns welcome message with JWT return to be implemented
const loginUser = async (request, response) => {
    try {
        let savedUser = await UserModel.findOne({email: request.body.email}).exec();

        // *To Do* Implement JWT generation and attach in response method 
        response.status(200).json({message: `welcome ${savedUser.userName}!`});
    } catch (error) {
        console.log(error)
        response.status(404).json({message: "User not found", error: error.message});
    }
}

module.exports = {
    getAllUsers,
    loginUser
}