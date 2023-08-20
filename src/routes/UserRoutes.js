const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    loginUser
} = require("../controllers/UserController")

// Route to get all users
// Made for development purposes.
// Not featured in the main application
router.get("/", getAllUsers);

// // Route to get single user
// // returns username of user to display in frontend component
// router.get("/user", getSingleUser);

// Route to allow login of single user
// Takes login information and runs through middleware, 
// returns authentication data.
router.post("/login", loginUser);

// // Route to allow user creation
// // Takes data from request, validate through middleware,
// // returns authentication data
// router.post("/signup", userCreation);


module.exports = router;