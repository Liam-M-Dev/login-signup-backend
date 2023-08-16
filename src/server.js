
// Reads .env data
const dotenv = require("dotenv");
dotenv.config()

// Import express package and configure needed data
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000

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