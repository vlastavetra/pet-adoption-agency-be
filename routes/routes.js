const express = require("express")
const {passwordsMatch, isNewUser, hashPwd, doesUserExist, isAdmin, isAuth}  = require("../middleware/userMiddleware.js")
const {createUser, loginUser, updateUser, getAllUsers, getUserData, getUserPets} = require("../controllers/usersController.js")
const {createPet, deletePet, getAllPets, updatePet, getPet, savePet, unSavePet, getSaved, adoptPet, returnPet} = require("../controllers/petsController.js")

const router = express.Router();

router.route("/signup").post(passwordsMatch, isNewUser, hashPwd, createUser)
router.route("/login").post(doesUserExist, loginUser)
//router.route("/user/:id").get(getUserData)//.patch(updateUser) // add isAuth
router.route("/user/pets").get(isAuth, getUserPets)

//router.route("/users").get(authenticateUser, isAdmin, getAllUsers)

router.route("/pets").get(getAllPets).post(createPet) //add isAdmin, isAuth
router.route("/pet/:id").get(getPet).patch(updatePet).delete(deletePet) // add isAdmin, isAuth
//router.route("/pet/:id/adopt").patch(adoptPet) // add isAuth
//router.route("/pet/:id/return").patch(returnPet) // add isAuth
//router.route("/pet/:id/save").patch(savePet).delete(unSavePet) // add isAuth

module.exports = router