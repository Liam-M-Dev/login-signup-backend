const express = require("express");
const router = express.Router();

// Imported functions from UserController
const {
    getAllUsers,
    loginUser,
    userCreation
} = require("../controllers/UserController")

// Imported middleware
const {
    loginMiddleware, checkUserFields, checkValidEmail,
    checkValidUsername
} = require("../middleware/UserMiddleware");

// const {
//     errorsArray,
//     errorsLength
// } = require("../middleware/ErrorHandling");

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
router.post("/login", 
    loginMiddleware, 
    loginUser
);

// // Route to allow user creation
// // Takes data from request, validate through middleware,
// // returns authentication data
router.post("/signup",
    checkUserFields, 
    checkValidEmail, 
    checkValidUsername,
    userCreation
);


module.exports = router;