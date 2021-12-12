const User = require("../models/users");
const Token = require("../models/tokens");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.signup = async (req, res) => {
  try {
    const re = /\S+@\S+\.\S+/;
    const { username, email, password } = req.body;

    if (!(email && password && username)) {
      res.status(400).json({ message: "All input is required" });
      return;
    }

    if (!re.test(email)) {
      res.status(400).json({ message: "Email is not correct" });
      return;
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      res.status(409).json({ message: "User Already Exist. Please Login" });
      return;
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

    await Token.create({
      _id: mongoose.Types.ObjectId(),
      username: user.username,
      email: email,
      token: token,
    });

    user.token = token;

    // return new user
    req.session.user = { ...req.session, user: user._id };
    res
      .status(201)
      .cookie("userId", user._id, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      })
      .json(user);
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

    // req.session.admin = true;
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

      req.session.user = { ...req.session, user: user._id };
      res
        .status(201)
        .cookie("userId", user._id, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
        })
        .json(user);
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.logout = async (req, res) => {
  if (req.cookies.userId) {
    delete req.session.user;

    res.clearCookie("userId");
    res.json({ result: "SUCCESS" });
  } else {
    res.json({ result: "ERROR", message: "User is not logged in." });
  }
};
