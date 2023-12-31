// Import mongoose
const mongoose = require("mongoose");
// Import functions to connect and disconnect database
const {databaseConnect, databaseDisconnect} = require("./database");
// Import user model and hashString function
const {UserModel} = require("./models/User");
const {hashString} = require("./services/AuthServices");

const dotenv = require("dotenv");
dotenv.config();

// Raw data for Users collection
const users = [
    {
        firstName: "John",
        lastName: "Doe",
        userName: "JohnDoe31",
        email: "JohnDoe@email.com",
        password: "TestPassword1!"
    },
    {
        firstName: "Jane",
        lastName: "Doe",
        userName: "JaneDoe13",
        email: "JaneDoe@email.com",
        password: "PasswordTest2@"
    }
];

// Connect to the database
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

// Then-Catch promise chain to connect and seed database 
// with added functionality
databaseConnect(databaseURL)
.then(() => {
    console.log("Database Connected");
}).catch(error => console.log(`Error occurred: \n ${error}`))
.then(async () => {
    if (process.env.WIPE == "true"){
        const collections = await mongoose.connection.db.listCollections().toArray();

        collections.map((collection) => collection.name)
        .forEach(async (collectionName) => {
            mongoose.connection.db.dropCollection(collectionName);
        });
        console.log("Old database data dropped");
    }
}).then( async () => {
    
    for (const user of users) {
        let hashedPassword = await hashString(user.password);
        user.password = hashedPassword;
    }

    await UserModel.insertMany(users);
    console.log("New database created")
}).then(() => {
    databaseDisconnect();
    console.log("Database disconnected");
}).catch(error => console.log(`Error occurred: \n ${error}`));
