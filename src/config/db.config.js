//MongoDB connection using Mongoose
const mongoose = require("mongoose");
const { env } = require("./env.config");

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log(" MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

module.exports = { connectDB };