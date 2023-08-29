const router = require("express").Router();
const Track = require("../models/Track.model");
const Album = require("../models/Album.model");
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const multer = require("multer");



// Define storage for uploaded songs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Where to store the uploaded files
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name
  }
});

// Create a Multer instance
const upload = multer({ storage: storage });


router.post("/track",  upload.single("mp3file"),

  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).send("No files uploaded.");
      }
      console.log("show req,file", req.file);
      const {
        duration,
        track_number,
        name,
        artist,
      } = req.body;
      
      console.log("show req.body", req.body);
      const createdTrackDB = await Track.create({
        filename: req.file.path,
        duration,
        track_number,
        name,
        artist,
      });
      res.status(201).json({ createdTrackDB });
      console.log("show created track", createdTrackDB);
    } catch (err) {
      console.log("====through Track  error ====there we go==>", err);
    }
  }
);

module.exports = router;
