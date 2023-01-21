const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  getUserByEmailModel,
  getUserByIdModel,
} = require("../models/usersModels");

const passwordsMatch = (req, res, next) => {
  const { password, repassword } = req.body;
  if (password !== repassword) {
    res.status(400).send("Password dont match");
    return;
  }

  next();
};

const validateUserData = async (req, res, next) => {
  const { firstname, lastname, email, password, repassword, phone } = req.body;
  if (!firstname || !lastname || !email || !password || !repassword || !phone) {
    res.status(400).send("Required provide all values");
    return;
  }
  next();
};

const validateUserLoginData = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Required provide all values");
    return;
  }
  next();
};

const validatePetData = async (req, res, next) => {
  const { name, type, adoptionStatus, height, weight, color, hypoallergenic, breed } = req.body;

  if (req.file?.path) {
    req.body.picture = req.file.path
  };
  
  if (!name || !type || !adoptionStatus || !height || !weight || !color || !hypoallergenic || !breed ) {
    res.status(400).send("Required provide all values");
    return;
  }
  next();
};

const isNewUser = async (req, res, next) => {
  const user = await getUserByEmailModel(req.body.email);
  if (user) {
    res.status(400).send("User already exists");
    return;
  }
  next();
};

const hashPwd = (req, res, next) => {
  if (req.body.password) {
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      req.body.password = hash;
      next();
    });
  }
  return next();
};

const doesUserExist = async (req, res, next) => {
  const user = await getUserByEmailModel(req.body.email);
  if (!user) {
    res.status(400).send("User with this email does not exist");
    return;
  }

  req.body.user = user;
  next();
};

const isAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send("Authorization headers required");
    return;
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send("Unauthorized");
      return;
    }

    if (decoded) {
      req.body.userId = decoded.id;
      next();
    }
  });
};

const isAdmin = async (req, res, next) => {
  const user = await (req.body.userId
    ? getUserByIdModel(req.body.userId)
    : getUserByEmailModel(req.body.email));

  if (!user.isAdmin) {
    res.status(403).send("Forbidden");
    return;
  } else {
    req.body.isAdmin = true;
    return next();
  }
};

const getUserId = (req, res, next) => {
  if (!req.headers.authorization) {
    return;
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send("Unauthorized");
      return;
    }

    if (decoded) {
      req.body.userId = decoded.id;
      next();
    }
  });
};

const checkUserPets = async (req, res, next) => {
  const { userId } = req.body;
  const { id } = req.params;
  const user = await getUserByIdModel(userId);
  req.body.isSavedPet = user.savedPets.includes(id);
  req.body.isOwnedPets = user.ownedPets.includes(id);
  next();
};

module.exports = {
  passwordsMatch,
  validateUserData,
  validateUserLoginData,
  isNewUser,
  hashPwd,
  doesUserExist,
  isAuth,
  isAdmin,
  getUserId,
  checkUserPets,
  validatePetData
};
