const router = require("express").Router();
const Album = require("../models/Album.model");
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middlewares/jwt.middleware");


//get route /api/ablum
router.get("/album", async (req, res, next)=> {
    try {
const getAlbumDb = await Album.find()
res.status(201).json({ getAlbumDb });
    }catch (err) {
        console.log(
          "====error while getting all album====there we go==>",
          err
        );
      }
})


// Set up post route /api/album for  album and image  upload
router.post(
  "/album",
  fileUploader.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).send("No files uploaded.");
      
      }
      console.log("show req.file", req.file)

      // Create a new album record in the database
      const {
        total_tracks,
        title,
        release_date,
        genre,
        popularity,
        album_type,
       
      } = req.body;
console.log("show req erro", req.body)
      const createAlbumDB = await Album.create({
        total_tracks,
        title,
        release_date,
        genre,
        popularity,
        artist:[],
        album_type,
        image: req.file.path,
        track: []
    
      });
      res.status(201).json({ createAlbumDB });
      console.log("show create album",createAlbumDB )
      //   res.json({ fileupload: req.file.path });
    } catch (err) {
      console.log(
        "====through album  error ====there we go==>",
        err
      );
    }
  }
);

module.exports = router;
