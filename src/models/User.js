const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },

  email: {
    type: String,
    //unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "Member",
  },

  theme: {
    type: String,
    default: "off",
  },

  name: {
    type: String,
    default: "--DF6A872H43--",
  },

  nationality: {
    type: String,
    default: "-",
  },

  profile_img: {
    type: String,
    default: "/images/profile/gears.jpg",
  },

  website: {
    type: String,
    default: "-",
  },

  youtube: {
    type: String,
    default: "-",
  },

  contactEmail: {
    type: String,
    default: "-",
  },

  bio: {
    type: String,
    default: "-",
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  try {
    // generate a salt
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    console.log(error);
    throw new Error("Error al codificar la contraseña");
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);


