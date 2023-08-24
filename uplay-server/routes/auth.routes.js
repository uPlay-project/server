const router = require("express").Router();
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const { isAuthenticated } = require("../middlewares/jwt.middleware");

router.post("/signup", (req, res, next) => {
  const { firstName, lastName, email, password, state, country } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide emailƒ and password" });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characts and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  User.findOne({ email })
    .then((foundUserDB) => {
      if (foundUserDB) {
        res.status(400).json({ message: "User already exist" });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPasswword = bcrypt.hashSync(password, salt);
      return User.create({
        firstName,
        lastName,
        email,
        password: hashedPasswword,
        state,
        country,
      });
    })

    .then((registerUser) => {
      const {
        firstName,
        lastName,
        email,
        password: hashedPasswword,
        state,
        country,
      } = registerUser;

      const newUser = {
        firstName,
        lastName,
        email,
        password: hashedPasswword,
        state,
        country,
      };
      res.status(201).json({ newUser: newUser });
    })

    .catch((error) => {
      console.log("===showRegisterError==>", error);
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Provide email and password" });
  }

  User.findOne({
    email,
  })
    .then((foundUserDB) => {
      if (!foundUserDB) {
        res.status(401).json({
          message: "user not found",
        });
      }

      const correctPassword = bcrypt.compareSync(
        password,
        foundUserDB.password
      );

      if (correctPassword) {
        const { _id, firstName, lastName, email, state, country } = foundUserDB;
        const payload = { _id, firstName, lastName, email, state, country };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({
          message: "Unable to aunthenticate the user",
        });
      }
    })
    .catch((err) => {
      console.log("====show=login==error===>", err);
    });
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log("req.payload", req.body);
  res.status(200).json(req.payload);
});

module.exports = router;
