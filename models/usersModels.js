const fs = require("fs")
const path = require("path")
const pathToUserDb = path.resolve(__dirname, "../db/UsersDataSet.json")

const allUsers = fs.readFileSync(pathToUserDb)

const getUserByEmailModel = async (email) => {
  const jsonData = JSON.parse(allUsers)
  return jsonData.find(obj => obj.email === email)
};

module.exports = {getUserByEmailModel};