const fs = require("fs")
const path = require("path")
const pathToPetsDb = path.resolve(__dirname, "../db/PetsDataSet.json")

const allPets = fs.readFileSync(pathToPetsDb)

const getAllPets = async (req, res) => {
  // search!
  res.status(200).send(JSON.parse(allPets))
}

const getPet = async (req, res) => {
  const {id: petId} = req.params;
  const pet = JSON.parse(allPets).find(obj => obj.id === petId)
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

const deletePet = async (req, res) => {
  const {id: petId} = req.params
  const jsonData = JSON.parse(allPets)
  const newArr = jsonData.filter(obj => obj.id !== petId)
  fs.writeFileSync(pathToPetsDb, JSON.stringify(newArr))
  res.status(200).send("Deleted")
}

module.exports = {getAllPets, getPet, createPet, updatePet, deletePet}