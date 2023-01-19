const express = require("express");
const User = require("../models/user.model");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const app = express.Router();

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = await argon2.hash(password);
    const user = await User.create({ email, password: hashed });
    res.send({ error: false, data: user, message: "Singup Successful" });
  } catch (e) {
    res.send({ error: true, message: "something went wrong" });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const match = await argon2.verify(user.password, password);
    if (!match) {
      res.send({ error: true, message: "Invalid Credentials" });
    } else {
      const token = jwt.sign({ email }, process.env.JWT_SECRET);
      res.send({ error: false, token, message: "Login Successful" });
    }
  } catch (e) {
    res.send({ error: true, message: "No User Found" });
  }
});

module.exports = app;
