const express = require("express");
const { upload } = require("../middleware/imagesMiddleware");
const {
  isAdmin,
  isAuth,
  getUserId,
  checkUserPets,
  validatePetData,
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

router.route("/").get(getAllPets).post(isAuth, upload.single("picture"), isAuth, validatePetData, isAdmin, createPet);
router.route("/:id").get(getUserId, checkUserPets, getPet).patch(isAuth, upload.single("picture"), isAuth, validatePetData, isAdmin, updatePet);
router.route("/:id/adopt").patch(isAuth, adoptPet);
router.route("/:id/return").patch(isAuth, returnPet);
router.route("/:id/save").patch(isAuth, savePet);
router.route("/:id/unsave").patch(isAuth, unSavePet);

module.exports = router;
