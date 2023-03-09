require("dotenv").config()
const mongoose = require("mongoose");
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const DB = process.env.DB

mongoose.set("strictQuery", false);

async function startMongooseDB() {
  await mongoose.connect(
    `mongodb+srv://${USER}:${PASSWORD}@cluster0.dltd4ag.mongodb.net/${DB}?retryWrites=true&w=majority`
  );
}

module.exports = { startMongooseDB };
