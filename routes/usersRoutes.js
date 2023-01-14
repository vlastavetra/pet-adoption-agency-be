const express = require("express");
const {
  passwordsMatch,
  validateUserData,
  validateUserLoginData,
  isNewUser,
  hashPwd,
  doesUserExist,
  isAdmin,
  isAuth,
} = require("../middleware/middleware.js");
const {
  createUser,
  loginUser,
  updateUser,
  getAllUsers,
  getUserData,
  getFullUserData,
  getMyPets,
} = require("../controllers/usersController.js");

const router = express.Router();

router.route("/signup").post(validateUserData, passwordsMatch, isNewUser, hashPwd, createUser)
router.route("/login").post(validateUserLoginData, doesUserExist, loginUser)
router.route("/").get(isAuth, isAdmin, getAllUsers)
router.route("/pets").get(isAuth, getMyPets)
router.route("/:id").get(isAuth, getUserData).patch(isAuth, hashPwd, updateUser)
router.route("/:id/full").get(isAuth, isAdmin, getFullUserData)

module.exports = router