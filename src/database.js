const mongoose = require("mongoose");

// Database Connector function
async function databaseConnect(databaseURL){
    await mongoose.connect(databaseURL);
}

// Database Disconnect function
async function databaseDisconnect(){
    await mongoose.connection.close();
}


module.exports = {
    databaseConnect,
    databaseDisconnect
}