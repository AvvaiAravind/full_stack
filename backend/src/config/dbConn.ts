/**
 * MongoDB connection configuration using Mongoose
 */

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Validate environment variable
    if (!process.env.DATABASE_URI) {
      throw new Error("DATABASE_URI is not defined");
    }

    // Establish database connection
    const conn = await mongoose.connect(process.env.DATABASE_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
