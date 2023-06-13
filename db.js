const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGO_URL;

const connectToMongo = async () => {
  try {
    const conn = await mongoose.connect(mongoURI);
  } catch (error) {
    console.log("error============>", error);
  }
};

module.exports = connectToMongo;
