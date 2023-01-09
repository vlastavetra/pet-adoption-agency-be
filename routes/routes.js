const express = require("express")
const {passwordsMatch, isNewUser, hashPwd, doesUserExist, isAdmin, isAuth, getUserId}  = require("../middleware/userMiddleware.js")
const {createUser, loginUser, updateUser, getAllUsers, getUserData, getUsers, getUserPets} = require("../controllers/usersController.js")
const {createPet, deletePet, getAllPets, updatePet, getPet, savePet, unSavePet, adoptPet, returnPet} = require("../controllers/petsController.js")

const router = express.Router();

router.route("/signup").post(passwordsMatch, isNewUser, hashPwd, createUser)
router.route("/login").post(doesUserExist, isAdmin, loginUser)
//router.route("/user/:id").get(isAuth, isAdmin, getUserData)//.patch(isAuth, isAdmin, updateUser)
//router.route("/user").get(isAuth, isAdmin, getUsers)
router.route("/user/pets").get(isAuth, getUserPets)

//router.route("/users").get(authenticateUser, isAdmin, getAllUsers)

router.route("/pet").get(getAllPets).post(isAuth, isAdmin, createPet)
router.route("/pet/:id").get(getUserId, getPet).patch(isAuth, isAdmin, updatePet)
router.route("/pet/:id/adopt").patch(isAuth, adoptPet)
router.route("/pet/:id/return").patch(isAuth, returnPet)
router.route("/pet/:id/save").patch(isAuth, savePet)
router.route("/pet/:id/unsave").patch(isAuth, unSavePet)

module.exports = router