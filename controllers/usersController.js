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
      phone: phone,
      isAdmin: false,
      userPets: []
    }
    const jsonData = JSON.parse(allUsers)
    const newArr = [...jsonData, obj]
    fs.writeFileSync(pathToUserDb, JSON.stringify(newArr))
    res.status(200).send(obj)
  } catch (err) {
    res.status(500).send(err)
  } 
}

const getUserData = async (req, res) => {
  const userId = req.body.userId
  const user = JSON.parse(allUsers).find(obj => obj.id === userId)
  const data = {
    "email": user.email,
    "firstname": user.firstname,
    "lastname": user. lastname,
    "phone": user. phone
  }
  res.status(200).send(data)
}

const getFullUserData = async (req, res) => {
  const userId = req.body.userId
  const user = JSON.parse(allUsers).find(obj => obj.id === userId)
  res.status(200).send(user)
}

const updateUser = async (req, res) => {
  const {email, password, firstname, lastname, phone, userId} = req.body

  const jsonData = JSON.parse(allUsers)
  const newArr = jsonData.map(obj => {
    if (obj.id === userId) {
      obj.email = email ? email : obj.email
      obj.password = password ? password : obj.password
      obj.firstname = firstname ? firstname : obj.firstname
      obj.lastname = lastname ? lastname : obj.lastname
      obj.phone = phone ? phone : obj.phone
      return obj
    }
  
    return obj;
  })
  fs.writeFileSync(pathToUserDb, JSON.stringify(newArr))
  res.status(200).send("Updated")
}

const loginUser = async (req, res) => {
  const { user, password, isAdmin} = req.body
  try {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(500).send(err)
      } else if (!result) {
        res.status(400).send("Password don't match")
      } else {
        const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '24h' })
        res.send({ token: token, firstname: user.firstname, lastname: user.lastname, id: user.id, isAdmin: isAdmin })
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

const getAllUsers = async (req, res) => {
  const jsonData = JSON.parse(allUsers)
  const newArr = jsonData.map(obj => {
    delete obj["password"]
    delete obj["isAdmin"]
    delete obj["userPets"]
    return obj
  })
  res.status(200).send(newArr)
}

module.exports = {createUser, loginUser, getUserPets, getUserData, getFullUserData, updateUser, getAllUsers}