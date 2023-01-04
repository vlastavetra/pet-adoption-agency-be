const express = require("express")
const {passwordsMatch, isNewUser, hashPwd, doesUserExist, isAdmin, isAuth, getUserId}  = require("../middleware/userMiddleware.js")
const {createUser, loginUser, updateUser, getAllUsers, getUserData, getUserPets} = require("../controllers/usersController.js")
const {createPet, deletePet, getAllPets, updatePet, getPet, savePet, unSavePet, adoptPet, returnPet} = require("../controllers/petsController.js")

const router = express.Router();

router.route("/signup").post(passwordsMatch, isNewUser, hashPwd, createUser)
router.route("/login").post(doesUserExist, loginUser)
//router.route("/user/:id").get(getUserData)//.patch(updateUser) // add isAuth
router.route("/user/pets").get(isAuth, getUserPets)

//router.route("/users").get(authenticateUser, isAdmin, getAllUsers)

router.route("/pets").get(getAllPets).post(createPet) //add isAdmin, isAuth
router.route("/pet/:id").get(getUserId, getPet).patch(updatePet) // add isAdmin, isAuth
router.route("/pet/:id/adopt").patch(isAuth, adoptPet)
router.route("/pet/:id/return").patch(isAuth, returnPet)
router.route("/pet/:id/save").patch(isAuth, savePet)
router.route("/pet/:id/unsave").patch(isAuth, unSavePet)

module.exports = router