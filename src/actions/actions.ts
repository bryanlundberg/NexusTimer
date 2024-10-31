"use server";

import connectDB from "@/db/mongodb";
import Backup, { Backups } from "@/models/backup";
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

export async function createOrUpdateBackup({
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
    const backup = await Backup.findOneAndUpdate(
      {
        user: user._id,
      },
      {
        data: data,
      },
      {
        upsert: true,
        new: true,
      }
    );

    if (!backup) throw new Error("Backup not created");
    return true;
  } catch (error: any) {
    console.log(error);
    return false;
  }
}

export async function getLastBackupDate({ email }: { email: string }) {
  try {
    await connectDB();
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("User not found");

    const backup = await Backup.findOne({
      user: user._id,
    });

    return backup ? backup.updatedAt.toString() : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getLastBackup({ email }: { email: string }) {
  try {
    await connectDB();
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("User not found");

    const backup = await Backup.findOne({
      user: user._id,
    })
      .select("data")
      .lean();

    return backup ? JSON.stringify(backup) : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
