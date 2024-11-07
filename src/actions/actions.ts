"use server";

import Email from "@/components/email/email";
import connectDB from "@/db/mongodb";
import Backup from "@/models/backup";
import User, { Users } from "@/models/user";
import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY || "development-placeholder-no-email-sent"
); // Optional: Allows other developers to work without configuring the email API. Simply its not going to connect to the API. Helps to avoid a pop-up error on screen.

export async function createOrUpdateUser({
  email,
  name,
  image,
}: Pick<Users, "email" | "name" | "image">) {
  try {
    await connectDB();

    const user = await User.findOne({ email });

    if (user) {
      user.image = image;
      user.name = name;
      await user.save();
    }

    if (!user) {
      await User.create({ email, name, image });
      const { data, error } = await resend.emails.send({
        from: "NexusTimer <onboarding@nexustimer.com>",
        to: [email],
        subject: "Welcome to NexusTimer – Let's Get Cubing!",
        react: Email({ name }) as React.ReactElement,
      });
    }

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
