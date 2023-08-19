const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("../db/conn");
const User = require("../model/UserSchema");
const authenticate = require("../middleware/authenticate");

// router.get("/register", (req, res) => {
//   res.send(`hello world from the server router js`);
// });

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Plz filled the filed properly" });
  }

  try {
    const userExit = await User.findOne({ email: email });
    if (userExit) {
      return res.status(422).json({ error: "Email already Exits" });
    }
    const user = new User({
      name,
      email,
      phone,
      work,
      password,
      cpassword,
    });

    await user.save();

    res.status(201).json({ message: "user registered successufilly" });
  } catch (err) {
    res.status(500).json({ error: "Failed to registered" });
    console.log(err);
  }
});

// login router

router.post("/signin", async (req, res) => {
  let token;
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in all the fields" });
    }

    const userLogin = await User.findOne({ email: email });
    // console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid credentials " });
      } else {
        res.json({ message: "user Signin Successfully" });
      }
    } else {
      return res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// about us ka page
router.get("/about", authenticate, async (req, res) => {
  console.log(`hello my About`);
  res.send(req.rootUser);
});

// get user data for contact and home Page
router.get("/get-data", authenticate, async (req, res) => {
  console.log(`hello my home page`);
  res.send(req.rootUser);
});

// logout Page

router.get("/logout", authenticate, async (req, res) => {
  console.log(`hello my logout page`);
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User logout");
});

module.exports = router;
