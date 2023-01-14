const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  adoptionStatus: { type: String, required: true, default: "Available" },
  picture: { type: String, required: false },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  color: { type: String, required: true },
  bio: { type: String, required: false },
  hypoallergnic: { type: Boolean, required: true, default: false },
  dietery: { type: String, required: false },
  breed: { type: String, required: true },
});

const Pet = mongoose.model("Pet", PetSchema);

async function getPetByIdModel(id) {
  try {
    const pet = await Pet.findOne({ _id: id });
    return pet;
  } catch (err) {
    console.log(err);
  }
}

async function addPetModel(obj) {
  try {
    const pet = await Pet.create(obj);
    return pet;
  } catch (err) {
    console.log(err);
  }
}

async function updatePetModel(id, obj) {
  try {
    const pet = await Pet.findOneAndUpdate({ _id: id }, obj, {
      new: true,
    });
    return pet;
  } catch (err) {
    console.log(err);
  }
}

async function getPetsModel(arr) {
  const { type, name, status, height, weight } = arr;
  const obj = {};

  if (type) {
    obj.type = type;
  }
  if (status) {
    obj.status = status;
  }
  if (height) {
    obj.height = height;
  }
  if (weight) {
    obj.weight = weight;
  }
  if (name) {
    obj.name = name;
  }

  try {
    const pets = await Pet.find(obj);
    return pets;
  } catch (err) {
    console.log(err);
  }
}

async function getUserPets(obj) {
  try {
    const pets = await Pet.find(obj)
    return pets;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  Pet,
  getPetByIdModel,
  addPetModel,
  updatePetModel,
  getPetsModel,
  getUserPets
};
