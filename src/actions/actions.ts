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

export async function createBackup({
  email,
  data,
}: {
  email: string;
  data: string;
}) {
  try {
    await connectDB();
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("User not found");
    const backup = await Backup.create({
      user: user._id,
      data: data,
    });
    if (!backup) throw new Error("Backup not created");
    return true;
  } catch (error: any) {
    console.log(error);
    return false;
  }
}
