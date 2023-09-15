
const router = require("express").Router();
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const { isAuthenticated, isAdmin } = require("../middlewares/jwt.middleware");


function isGmailOrYahooEmail(email) {
  const gmailPattern = /@(gmail\.com|googlemail\.com)$/i;
  const yahooPattern = /@(yahoo\.com|yahoo\.co\.[a-z]{2})$/i;

  if (gmailPattern.test(email)) {
    return 'Gmail';
  } else if (yahooPattern.test(email)) {
    return 'Yahoo Mail';
  } else {
    return 'Other';
  }
}


router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password, state, country } = req.body;

  
    if (!email || !password || !username) {
      return res.status(400).json({ message: "Please provide email, username, and password" });
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }


    const emailType = isGmailOrYahooEmail(email);

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must have at least 6 characters and include at least one number, one lowercase letter, and one uppercase letter.",
      });
    }


    const foundUserDB = await User.findOne({ email });
    if (foundUserDB) {
      return res.status(400).json({ message: "User already exists" });
    }


    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const registerUser = await User.create({
      username,
      email,
      password: hashedPassword,
      state,
      country,
    });

    const newUser = {
      username,
      email,
      password: hashedPassword,
      state,
      country,
    };

    res.status(201).json({ newUser });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login Route: User login and JWT token generation
router.post("/login", (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!(email || username) || !password) {
    return res.status(400).json({ message: "Provide email or username and password" });
  }

  let check;
  if (email) {
    check = { email };
  } else {
    check = { username };
  }


  User.findOne(check)
    .then((foundUserDB) => {
      if (!foundUserDB) {
        res.status(401).json({
          message: "User not found",
        });
      }

    
      const correctPassword = bcrypt.compareSync(password, foundUserDB.password);

      if (correctPassword) {
     
        const { _id, username, email, state, country } = foundUserDB;
        const payload = { _id, username, email, state, country, role: 'user' }; // Default role is 'user'

    
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({
          message: "Unable to authenticate the user",
        });
      }
    })
    .catch((err) => {
      console.error("Error during login:", err);
    });
});

// Verify Route: Protected route for user authentication
router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});


router.get("/admin-protected", isAuthenticated, isAdmin, (req, res) => {
  res.json({ message: "Admin authenticated successfully!" });
});

module.exports = router;









// const router = require("express").Router();
// const User = require("../models/User.model");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const saltRounds = 10;
// const { isAuthenticated , isAdmin} = require("../middlewares/jwt.middleware");



// function isGmailOrYahooEmail(email) {
//   const gmailPattern = /@(gmail\.com|googlemail\.com)$/i;
//   const yahooPattern = /@(yahoo\.com|yahoo\.co\.[a-z]{2})$/i;

//   if (gmailPattern.test(email)) {
//     return 'Gmail';
//   } else if (yahooPattern.test(email)) {
//     return 'Yahoo Mail';
//   } else {
//     return 'Other';
//   }
// }


// router.post("/signup", async (req, res, next) => {
//   try {
//     const { username, email, password, state, country } = req.body;

//     if (!email || !password || !username) {
//       return res.status(400).json({ message: "Please provide email, username, and password" });
//     }

//     const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailPattern.test(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }

//     const emailType = isGmailOrYahooEmail(email);

//     const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         message: "Password must have at least 6 characters and include at least one number, one lowercase letter, and one uppercase letter.",
//       });
//     }

//     const foundUserDB = await User.findOne({ email });
//     if (foundUserDB) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const salt = bcrypt.genSaltSync(saltRounds);
//     const hashedPassword = bcrypt.hashSync(password, salt);
//     const registerUser = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//       state,
//       country,
//     });

//     const newUser = {
//       username,
//       email,
//       password: hashedPassword,
//       state,
//       country,
//     };

//     res.status(201).json({ newUser });
//   } catch (error) {
//     console.error("Error during user registration:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });






// router.post("/login", (req, res, next) => {
//   const {username, email, password } = req.body;

//   if (!(email || username) || !password) {
//     return res.status(400).json({ message: "Provide email or username and password" });
//   }
//   let check;
//   if(email){
//     check = {email};
//   }else{
//     check = {username}
//   }

//   User.findOne(check)
//     .then((foundUserDB) => {
//       if (!foundUserDB) {
//         res.status(401).json({
//           message: "user not found",
//         });
//       }

//       const correctPassword = bcrypt.compareSync(
//         password,
//         foundUserDB.password
//       );

//       if (correctPassword) {
//         const { _id, username, email, state, country } = foundUserDB;
//         const payload = { _id, username, email, state, country };

//         const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
//           algorithm: "HS256",
//           expiresIn: "6h",
//         });
//         res.status(200).json({ authToken: authToken });
//       } else {
//         res.status(401).json({
//           message: "Unable to aunthenticate the user",
//         });
//       }
//     })
//     .catch((err) => {
//       console.log("====show=while login==error===>", err);
//     });
// });

// router.get("/verify", isAuthenticated, (req, res, next) => {
//   console.log("req.payload", req.body);
//   res.status(200).json(req.payload);
// });



// router.get("/admin-protected", isAuthenticated, isAdmin, (req, res) => {
//   res.json({ message: "Admin authenticated successfully!" });
// });






// module.exports = router;
