import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URI) {
      throw new Error("DATABASE_URI is not defined");
    }

    const conn = await mongoose.connect(process.env.DATABASE_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
export default connectDB;
