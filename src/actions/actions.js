"use server";

import User from "@/models/user";
import connectDB from "@/db/mongodb";

export async function createFake() {
  try {
    await connectDB();

    const asd = await User.create({
      msg: Math.random().toString(),
    });

    console.log(asd);
  } catch (error) {
    return { errMsg: error.message };
  }
}
