
// Reads .env data
const dotenv = require("dotenv");
dotenv.config()

// Import express package and configure needed data
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000

// Import mongoose, and configure database connection
const mongoose = require("mongoose");
var databaseURL = "";
switch (process.env.NODE_ENV.toLowerCase()) {
    case "test":
        databaseURL = process.env.TEST_DATABASEURL;
        break;
    case "development":
        databaseURL = process.env.LOCAL_DATABASEURL;
        break;
    case "production":
        databaseURL = process.env.PROD_DATABASEURL;
        break;
    default:
        console.error("Incorrect environment specified, \
        database will not be connected");
        break;
}

const {databaseConnect} = require("./database");
databaseConnect(databaseURL).then(() => {
    console.log("Database connected successfully!");
}).catch(error => 
    console.log(`Error occurred connecting database: 
    \n ${error}`));

// Configure helmet settings
const helmet = require("helmet");
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"]
    }
}));

// Configure basic CORS settings
const cors = require("cors");
var corsOptions = {
    origin: ["http://localhost:5000"],
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// API configuration to use JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (request, response) => {
    response.json({
        message: "Hello World"
    });
});

app.get("*", (request, response) => {
    response.status(404).json({
        message: "No route exists",
        attemptedPath: request.path
    });
});

module.exports = {
    app, PORT
}