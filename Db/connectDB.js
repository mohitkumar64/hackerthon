const mongoose  = require("mongoose");

async function ConnectDb(url) {
    await mongoose.connect(url);
}

module.exports = ConnectDb;