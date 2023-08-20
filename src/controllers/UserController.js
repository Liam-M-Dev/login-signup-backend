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



module.exports = {
    getAllUsers,
}