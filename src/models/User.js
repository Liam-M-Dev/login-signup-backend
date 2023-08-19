// User Schema/Model to save in users collection 
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    firstName: {type: String, 
        required: true},
    lastName: {type: String, 
        required: true},
    userName: {type: String, 
        required: true, unique: true},
    email: {type: String,
        required: true, unique: true},
    password: {type: String,
        required: true, minLength: 8}
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = {UserModel}