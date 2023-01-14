const {
  addUserModel,
  getUserByIdModel,
  updateUserModel,
  getUsersModel,
} = require("../models/usersModels");
const { getUserPets } = require("../models/petsModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createUser = async (req, res) => {
  try {
    const user = await addUserModel(req.body);
    res.status(200).send("Created");
  } catch (err) {
    res.status(500).send(err);
  }
};

const getUserData = async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await getUserByIdModel(userId);
    const obj = {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
    };
    res.status(200).send(obj);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getFullUserData = async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await getUserByIdModel(userId);
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateUser = async (req, res) => {
  try {
    const edited = await updateUserModel(req.body);
    if (edited) {
      res.status(200).send("Updated");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const loginUser = async (req, res) => {
  const { user, password } = req.body;
  try {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else if (!result) {
        res.status(400).send("Password don't match");
      } else {
        const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
          expiresIn: "24h",
        });
        res.status(200).send({
          token: token,
          firstname: user.firstname,
          lastname: user.lastname,
          id: user.id,
          isAdmin: user.isAdmin,
        });
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getMyPets = async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await getUserByIdModel(userId);
    const savedPets = await getUserPets({ _id: { $in: user.savedPets } });
    const ownedPets = await getUserPets({ _id: { $in: user.ownedPets } });
    const obj = {
      savedPets: savedPets,
      ownedPets: ownedPets,
    };
    res.status(200).send(obj);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await getUsersModel();
    const newArr = allUsers.map((obj) => {
      delete obj["password"];
      delete obj["isAdmin"];
      delete obj["userPets"];
      return obj;
    });
    res.status(200).send(newArr);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  createUser,
  loginUser,
  getMyPets,
  getUserData,
  getFullUserData,
  updateUser,
  getAllUsers,
};
