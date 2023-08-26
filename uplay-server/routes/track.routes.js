const router = require("express").Router();
const Track = require("../models/Track.model");
const Album = require("../models/Album.model");
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const multer = require("multer");

//configure Multer for handling track file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const trackupload = multer({ storage: storage });

// post route for track multiple upload
router.post(
  "/track",
  trackupload.array("tracks", 10),
  fileUploader.single("filename"),
  isAuthenticated,
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).send("No files uploaded.");
      }

      //now create album
      const {
        lyrics,
        popularity,

        filename,
        release_date,
        duration,
        genre,
        track_number,
      } = req.body;

      const createdTrackDB = await Track.create({
        lyrics,
        popularity,
        image,
        filename,
        release_date,
        duration,
        genre,
        track_number,
      });
      res.status(201).json({ createdTrackDB });
      //   res.json({ fileupload: req.file.path });
    } catch (err) {
      console.log(
        "====through Track  error ====there we go==>",
        err
      );
    }
  }
);

module.exports = router;
