const User = require("../models/users");
const Token = require("../models/tokens");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.signup = async (req, res) => {
  try {
    const re = /\S+@\S+\.\S+/;

    const { username, email, password } = req.body;

    // Validate user input
    if (!(email && password && username)) {
      res.status(400).json({ message: "All input is required" });
    }
    if (!re.test(email)) {
      res.status(400).json({ message: "Email is not correct" });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .json({ message: "User Already Exist. Please Login" });
    }
    let _id = mongoose.Types.ObjectId();
    const user = await User.create({
      _id,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY, {
      expiresIn: 86400, // 24 hours
    });
    res.cookie("user", user._id);

    await Token.create({
      _id: mongoose.Types.ObjectId(),
      username: user.username,
      email: email,
      token: token,
    });

    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};

exports.signin = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).json({ message: "All input is required" });
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      await Token.create({
        _id: mongoose.Types.ObjectId(),
        username: user.username,
        email: email,
        token: token,
      });
      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).json({ message: "Invalid Credentials" });
  } catch (err) {
    console.log(err);
  }
};
