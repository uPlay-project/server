// const router = require("express").Router();
// const Album = require("../models/Album.model");
// const User = require("../models/User.model");


const router = require("express").Router();
const Album = require("../models/Album.model");
const User = require("../models/User.model");

const { isAuthenticated } = require("../middlewares/jwt.middleware");


router.get("/username/:username", isAuthenticated, async (req, res) => {
    try {
      const { username } = req.params; 
  
     
      console.log(req.headers);
  
      const user = await User.findOne({ username }); 
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  

      res.json({ user });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Error fetching user data" });
    }
  });
  

// // GET user data by username
// router.get("/username/:username", isAuthenticated,  async (req, res) => {
//   try {
//     const { username } = req.params; // Get the username from the route parameter

//     const user = await User.findOne({ username }); // Find the user by username

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Send the user data as JSON response
//     res.json({ user });
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     res.status(500).json({ error: "Error fetching user data" });
//   }
// });

// GET user library
router.get("/library", isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.user; 

    const user = await User.findById(userId).populate("library");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const library = user.library;
    res.json({ library });
  } catch (error) {
    console.error("Error fetching user library:", error);
    res.status(500).json({ error: "Error fetching user library" });
  }
});


router.post("/add", isAuthenticated, async (req, res) => {
  try {
    const { userId, albumId } = req.body; 

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!albumId) {
      return res.status(400).json({ error: "Invalid album ID" });
    }

    user.library.push(albumId);
    await user.save();

    res.json({ message: "Album added to library successfully" });
  } catch (error) {
    console.error("Error adding album to library:", error);
    res.status(500).json({ error: "Error adding album to library" });
  }
});


router.delete("/remove/:albumId", isAuthenticated, async (req, res) => {
  try {
    const { albumId } = req.params; 
    const { userId } = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const albumIndex = user.library.indexOf(albumId);
    if (albumIndex === -1) {
      return res.status(404).json({ error: "Album not found in user's library" });
    }

    user.library.splice(albumIndex, 1);
    await user.save();

    res.json({ message: "Album removed from library successfully" });
  } catch (error) {
    console.error("Error removing album from library:", error);
    res.status(500).json({ error: "Error removing album from library" });
  }
});

module.exports = router;









