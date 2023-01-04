const fs = require("fs")
const path = require("path")
const pathToPetsDb = path.resolve(__dirname, "../db/PetsDataSet.json")
const {updateUserPets, deleteUserPets} = require("../models/usersModels");

const allPets = fs.readFileSync(pathToPetsDb)

const getAllPets = async (req, res) => {
  // search!
  res.status(200).send(JSON.parse(allPets))
}

const getPet = async (req, res) => {
  const {id: petId} = req.params
  const userId = req.body.userId
  const obj = JSON.parse(allPets).find(obj => obj.id === petId)
  const isAdoptedByUser = obj.adoptedByUser === userId
  const isSavedByUser = obj.savedByUsers?.includes(userId)
  const pet = {...obj, adoptedByUser: isAdoptedByUser, savedByUser: isSavedByUser}
  res.status(200).send(pet)
}

const createPet = async (req, res) => {
  const {type, name, status, img, height, weight, color, hypoallergenic, bio, breed, dietery} = req.body
  const obj = {
    id: crypto.randomUUID(),
    type: type,
    name: name,
    status: status,
    img: img,
    height: height,
    weight: weight,
    color: color,
    hypoallergenic: hypoallergenic,
    bio: bio, 
    breed: breed,
    dietery: dietery
  }
  const jsonData = JSON.parse(allPets)
  const newArr = [...jsonData, obj]
  fs.writeFileSync(pathToPetsDb, JSON.stringify(newArr))
  res.status(200).send(obj)
}

const updatePet = async (req, res) => {
  const {id: petId} = req.params
  const {type, name, status, img, height, weight, color, hypoallergenic, bio, breed, dietery} = req.body
  const jsonData = JSON.parse(allPets)
  const newArr = jsonData.map(obj => {
    if (obj.id === petId) {
      return {...obj, 
        type: type,
        name: name,
        status: status,
        img: img,
        height: height,
        weight: weight,
        color: color,
        hypoallergenic: hypoallergenic,
        bio: bio, 
        breed: breed,
        dietery: dietery
      };
    }
  
    return obj;
  });

  fs.writeFileSync(pathToPetsDb, JSON.stringify(newArr))
  res.status(200).send("Updated")
}

const adoptPet = async (req, res) => {
  const {id: petId} = req.params
  const userId = req.body.userId
  const arr = JSON.parse(allPets)
  const obj = arr?.find(obj => obj.id === petId)
  const newArr = arr?.filter(obj => obj.id !== petId)
  newArr.push({...obj, "adoptedByUser": `${userId}`, "adoptionStatus": true})
  updateUserPets(userId, petId, "adopted")
  fs.writeFileSync(pathToPetsDb, JSON.stringify(newArr))
  res.status(200).send({...obj, "adoptedByUser": `${userId}`, "adoptionStatus": true})
}

const returnPet = async (req, res) => {
  const {id: petId} = req.params
  const userId = req.body.userId
  const arr = JSON.parse(allPets)
  const obj = arr?.find(obj => obj.id === petId)
  const newArr = arr?.filter(obj => obj.id !== petId)
  newArr.push({...obj, "adoptedByUser": "", "adoptionStatus": false})
  deleteUserPets(userId, petId, "adopted")
  fs.writeFileSync(pathToPetsDb, JSON.stringify(newArr))
  res.status(200).send({...obj, "adoptedByUser": "", "adoptionStatus": false})
}

const savePet = async (req, res) => {
  const {id: petId} = req.params
  const userId = req.body.userId
  const arr = JSON.parse(allPets)
  const obj = arr?.find(obj => obj.id === petId)
  const newArr = arr?.filter(obj => obj.id !== petId)
  obj.savedByUsers?.push(userId)
  newArr.push(obj)
  updateUserPets(userId, petId, "saved")
  fs.writeFileSync(pathToPetsDb, JSON.stringify(newArr))
  res.status(200).send(obj)
}

const unSavePet = async (req, res) => {
  const {id: petId} = req.params
  const userId = req.body.userId
  const arr = JSON.parse(allPets)
  const obj = arr?.find(obj => obj.id === petId)
  const newArr = arr?.filter(obj => obj.id !== petId)
  const filtredArr = obj.savedByUsers.filter((str) => { return str !== userId })
  const newObj = {...obj, "savedByUsers": filtredArr}
  newArr.push(newObj)
  deleteUserPets(userId, petId, "saved")
  fs.writeFileSync(pathToPetsDb, JSON.stringify(newArr))
  res.status(200).send(newObj)
}

module.exports = {getAllPets, getPet, createPet, updatePet, adoptPet, returnPet, savePet, unSavePet}