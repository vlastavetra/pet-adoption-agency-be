const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  phone: { type: Number, required: true },
  savedPets: [{ type: String, required: false }],
  ownedPets: [{ type: String, required: false }],
});

const User = mongoose.model("User", UserSchema);

async function getUserByEmailModel(email) {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (err) {
    console.log(err);
  }
}

async function getUserByIdModel(id) {
  try {
    const user = await User.findOne({ _id: id });
    return user;
  } catch (err) {
    console.log(err);
  }
}

async function addUserModel(obj) {
  try {
    const user = await User.create(obj);
    return user;
  } catch (err) {
    console.log(err);
  }
}

async function updateUserModel(obj, id) {
  try {
    const user = await User.findOneAndUpdate(
      { _id: obj.userId ? obj.userId : id },
      obj,
      { new: true }
    );
    return user;
  } catch (err) {
    console.log(err);
  }
}

async function getUsersModel() {
  try {
    const users = await User.find(obj);
    return users;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  User,
  getUserByEmailModel,
  getUserByIdModel,
  addUserModel,
  updateUserModel,
  getUsersModel,
};
