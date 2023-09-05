const router = require("express").Router();
const Album = require("../models/Album.model");
const Artist = require("../models/Artist.model");
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middlewares/jwt.middleware");


const mongoose = require('mongoose');


// Create a new artist
router.post("/artist", fileUploader.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
        return res.status(400).send("No files uploaded.");
      }

    const { name, genre, popularity } = req.body;

    const newArtist = await Artist.create({ name, genre, image:req.file.path, popularity });
    res.status(201).json({ artist: newArtist });
  } catch (err) {
    console.error("Error creating artist:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all artists
router.get("/artist", async (req, res, next) => {
  try {
    const artists = await Artist.find();
    res.status(200).json({ artists });
  } catch (err) {
    console.error("Error getting all artists:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get artist by ID
router.get("/artist/:id", async (req, res, next) => {
  try {
    const artistId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
        return res.status(400).json({ message: "Specified id is not valid" });
      }
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }
    res.status(200).json({ artist });
  } catch (err) {
    console.error("Error getting artist by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update artist by ID
router.put("/artist/:id", async (req, res, next) => {
  try {
    const artistId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
        return res.status(400).json({ message: "Specified id is not valid" });
      }
    const { name, genre, image, popularity } = req.body;
    const updatedArtist = await Artist.findByIdAndUpdate(
      artistId,
      { name, genre, image, popularity },
      { new: true }
    );
    if (!updatedArtist) {
      return res.status(404).json({ error: "Artist not found" });
    }
    res.status(200).json({ artist: updatedArtist });
  } catch (err) {
    console.error("Error updating artist by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/artist/:id", async (req, res, next) => {
  try {
    const artistId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
        return res.status(400).json({ message: "Specified id is not valid" });
      }
    const deletedArtist = await Artist.findByIdAndRemove(artistId);
    if (!deletedArtist) {
      return res.status(404).json({ error: "Artist not found" });
    }
    res.status(200).json({ message: "Artist deleted successfully" });
  } catch (err) {
    console.error("Error deleting artist by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/artist/:id/album", async (req, res) => {
    try {
      const {artistId} = req.params.id
      if (!mongoose.Types.ObjectId.isValid(req.params.artistId)) {
        return res.status(400).json({ error: "Invalid artist ID" });
      }
  

    //   const artistId = req.params.artistId;
      const albums = await Album.find({ artist: artistId });
  
      if (!albums || albums.length === 0) {
        return res.status(404).json({ message: "No albums found for this artist" });
      }
  
      res.status(200).json({ albums });
    } catch (error) {
      console.error("Error fetching artist albums:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router;






