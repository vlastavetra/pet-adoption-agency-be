const fs = require("fs")
const path = require("path")
const pathToUserDb = path.resolve(__dirname, "../db/UsersDataSet.json")

const allUsers = fs.readFileSync(pathToUserDb)

const getUserByIdModel = async (id) => {
  const jsonData = JSON.parse(allUsers)
  return jsonData.find(obj => obj.id === id)
}

const getUserByEmailModel = async (email) => {
  const jsonData = JSON.parse(allUsers)
  return jsonData.find(obj => obj.email === email)
}

const updateUserPets = async (userId, petId, action) => {
  const arr = JSON.parse(allUsers)
  const user = arr.find(obj => obj.id === userId)
  const filtredArr = arr.filter(obj => obj.id !== userId)
  user.userPets.push({"id": petId, "list": action})
  filtredArr.push(user)
  fs.writeFileSync(pathToUserDb, JSON.stringify(filtredArr))
}

const deleteUserPets = async (userId, petId, action) => {
  const arr = JSON.parse(allUsers)
  const user = arr.find(obj => obj.id === userId)
  const filtredArr = arr.filter(obj => obj.id !== userId)
  const updatedUserPets = user.userPets.filter(obj => obj.id !== petId && obj.list !== action)
  filtredArr.push({...user, "userPets": updatedUserPets})
  fs.writeFileSync(pathToUserDb, JSON.stringify(filtredArr))
}

module.exports = {getUserByEmailModel, getUserByIdModel, updateUserPets, deleteUserPets};