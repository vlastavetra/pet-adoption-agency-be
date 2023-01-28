const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
dotenv.config();
const usersRoutes = require("./routes/usersRoutes.js");
const petsRoutes = require("./routes/petsRoutes.js");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({ origin: ['http://localhost:3000', 'https://pet-adoption-agency-server.vercel.app/'], credentials: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

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
    .set("strictQuery", true)
    .connect(process.env.MONGODB_URI, { 
      dbName: "adoptionAgencyDb",
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  if (connection) {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  }
}

init();
