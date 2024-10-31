import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return true;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    return true;
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
