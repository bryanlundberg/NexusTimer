"use server";

import User from "@/models/user";
import connectDB from "@/db/mongodb";
import Backup from "@/models/backup";

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

export async function createBackup() {
  try {
    await connectDB();

    const asd = await Backup.create({
      data: Math.random().toString(),
    });

    console.log(asd);
  } catch (error) {
    return { errMsg: error.message };
  }
}
