const fs = require("fs")
const path = require("path")
const pathToUserDb = path.resolve(__dirname, "../db/UsersDataSet.json")
const pathToPetsDb = path.resolve(__dirname, "../db/PetsDataSet.json")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const allUsers = fs.readFileSync(pathToUserDb)
const allPets = fs.readFileSync(pathToPetsDb)

const createUser = async (req, res) => {
  const {email, password, firsname, lastname, phone} = req.body
  try {
    const obj = {
      id: crypto.randomUUID(),
      email: email,
      password: password,
      firsname: firsname,
      lastname: lastname,
      phone: phone
    }
    const jsonData = JSON.parse(allUsers)
    const newArr = [...jsonData, obj]
    fs.writeFileSync(pathToUserDb, JSON.stringify(newArr))
    res.status(200).send(obj)
  } catch (err) {
    res.status(500).send(err)
  } 
}

//const getUserData = async (req, res) => {
//  const {id: userId} = req.params;
//  const user = JSON.parse(allUsers).find(obj => obj.id === userId)
//  const data = {
//    "email": user.email,
//    "firstname": user.firstname,
//    "lastname": user. lastname,
//    "phone": user. phone
//  }
//  res.status(200).send(data)
//}

const loginUser = async (req, res) => {
  const { user, password} = req.body
  try {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(500).send(err)
      } else if (!result) {
        res.status(400).send("Password don't match")
      } else {
        const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h' })
        res.send({ token: token, firstname: user.firstname, lastname: user.lastname })
      }
    })
  } catch (err) {
    res.status(500).send(err)
  }

  // extract passwords compare logic to middleware
};

const getUserPets = async (req, res) => {
  const userId = req.body.userId
  const user = JSON.parse(allUsers).find(obj => obj.id === userId)
  const array = []
  user.userPets.forEach(element => {
    const obj = JSON.parse(allPets).find(obj => obj.id === element.id);
    array.push({...obj, list: element.list})
  })
  res.status(200).send(array)
}

module.exports = {createUser, loginUser, getUserPets}