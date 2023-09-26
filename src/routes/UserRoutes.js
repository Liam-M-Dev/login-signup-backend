const express = require("express");
const router = express.Router();
// enable cookie-parser for use in app functionality
const cookieParser = require("cookie-parser");
router.use(cookieParser());

// Imported functions from UserController
const {
    getAllUsers,
    loginUser,
    userCreation,
    getUserById
} = require("../controllers/UserController")

// Imported middleware
const {
    loginMiddleware, checkUserFields, checkValidEmail,
    checkValidUsername, passwordLengthCheck
} = require("../middleware/UserMiddleware");


// Route to get all users
// Made for development purposes.
// Not featured in the main application
router.get("/", getAllUsers);

// // Route to get single user
// // returns username of user to display in frontend component
router.get("/user", getUserById);

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
    passwordLengthCheck,
    userCreation
);


module.exports = router;