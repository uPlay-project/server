const router = require("express").Router();
const fileUploader = require('../config/cloudinary.config');
const {isAuthenticated} = require('../middlewares/jwt.middleware');


router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.post("/upload", fileUploader.single("imageUrl"), isAuthenticated, (req, res, next) => {
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  

  res.json({ fileUrl: req.file.path });
});

module.exports = router;
