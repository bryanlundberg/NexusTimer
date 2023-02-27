// Set up mongoose connection
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const USER = "usernametest"
const PASSWORD = "passwordtest"
const DB = "cubestats"

async function startMongooseDB() {
  await mongoose.connect(
    `mongodb+srv://${USER}:${PASSWORD}@cluster0.dltd4ag.mongodb.net/${DB}?retryWrites=true&w=majority`
  );
}

module.exports = { startMongooseDB }