const {
  getPetByIdModel,
  addPetModel,
  updatePetModel,
  getPetsModel,
} = require("../models/petsModels");
const { updateUserModel } = require("../models/usersModels");

const getAllPets = async (req, res, next) => {
  const { search } = req.query;
  const arr = search.split("/").map((str) => str.split("-"));
  try {
    const allPets = await getPetsModel(arr);
    res.status(200).send(allPets);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getPet = async (req, res) => {
  const { id } = req.params;
  const { isSavedPet, isOwnedPets } = req.body;
  try {
    const pet = await getPetByIdModel(id);
    res.status(200).send({ ...pet._doc, isSavedPet, isOwnedPets });
  } catch (err) {
    res.status(500).send(err);
  }
};

const createPet = async (req, res) => {
  try {
    const pet = await addPetModel(req.body);
    res.status(200).send({ petId: pet._id, ok: true });
  } catch (err) {
    res.status(500).send(err);
  }
};

const updatePet = async (req, res) => {
  try {
    const edited = await updatePetModel(req.params.id, req.body);
    if (edited) {
      res.status(200).send("Updated");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const adoptPet = async (req, res) => {
  const { id } = req.params;
  try {
    const pet = updatePetModel(id, { adoptionStatus: "Adopted" });
    updateUserModel({ $push: { ownedPets: id } }, req.body.userId);
    if (pet) {
      res.status(200).send("Adopted");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const returnPet = async (req, res) => {
  const { id } = req.params;
  try {
    const pet = updatePetModel(id, { adoptionStatus: "Fostered" });
    updateUserModel({ $pull: { ownedPets: id } }, req.body.userId);
    if (pet) {
      res.status(200).send("Adopted");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const savePet = async (req, res) => {
  const { id } = req.params;
  try {
    const user = updateUserModel({ $push: { savedPets: id } }, req.body.userId);
    if (user) {
      res.status(200).send("Saved");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const unSavePet = async (req, res) => {
  const { id } = req.params;
  try {
    const user = updateUserModel({ $pull: { savedPets: id } }, req.body.userId);
    if (user) {
      res.status(200).send("Unsaved");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getAllPets,
  getPet,
  createPet,
  updatePet,
  adoptPet,
  returnPet,
  savePet,
  unSavePet,
};
