const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

dotenv.config({ path: "./config.env" });
require("./db/conn");

app.use(express.json());

const User = require("./model/UserSchema");

// we link the router files to make our route easy
app.use(require("./router/auth"));

const PORT = process.env.PORT;

app.get("/sign-in", (req, res) => {
  console.log("hello from my side");
  res.send("hello from sign-in side");
});
app.get("/sign-up", (req, res) => {
  res.send("hello from sign-up side");
});

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 60000, // increase the timeout to 30 seconds
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running at port no  ${PORT}`);
    });
  })
  .catch((err) => console.log(err.message));
