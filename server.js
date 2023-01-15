const express = require("express");
const cors = require("cors");
require("dotenv").config();
const usersRoutes = require("./routes/usersRoutes.js");
const petsRoutes = require("./routes/petsRoutes.js");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

app.use("/user", usersRoutes);
app.use("/pet", petsRoutes);

app.use("*", (req, res) => {
  res.status(404).send({ message: "Oops page not found" });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).send(err.message);
});

async function init() {
  const connection = await mongoose
    .set("strictQuery", false)
    .connect(process.env.MONGO_URI, { dbName: "adoptionAgencyDb" });
  if (connection) {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  }
}

init();
