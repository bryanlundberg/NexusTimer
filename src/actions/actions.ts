"use server";

import connectDB from "@/db/mongodb";
import Backup from "@/models/backup";
import User, { Users } from "@/models/user";

export async function createOrUpdateUser({
  email,
  name,
  image,
}: Pick<Users, "email" | "name" | "image">) {
  try {
    await connectDB();

    const user = await User.findOneAndUpdate(
      {
        email: email,
      },
      {
        name,
        image,
      },
      {
        new: true,
        upsert: true,
      }
    );

    if (!user) throw new Error("Not user");

    return true;
  } catch (error) {
    return false;
  }
}

export async function createBackup() {
  try {
    await connectDB();

    const asd = await Backup.create({
      data: Math.random().toString(),
    });

    console.log(asd);
  } catch (error: any) {
    return { errMsg: error.message };
  }
}
