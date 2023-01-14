const express = require("express");
const {
  isAdmin,
  isAuth,
  getUserId,
  checkUserPets,
} = require("../middleware/middleware.js");
const {
  createPet,
  getAllPets,
  updatePet,
  getPet,
  savePet,
  unSavePet,
  adoptPet,
  returnPet,
} = require("../controllers/petsController.js");

const router = express.Router();

router.route("/").get(getAllPets).post(isAuth, isAdmin, createPet)
router.route("/:id").get(getUserId, checkUserPets, getPet).patch(isAuth, isAdmin, updatePet)
router.route("/:id/adopt").patch(isAuth, adoptPet)
router.route("/:id/return").patch(isAuth, returnPet)
router.route("/:id/save").patch(isAuth, savePet)
router.route("/:id/unsave").patch(isAuth, unSavePet)

module.exports = router