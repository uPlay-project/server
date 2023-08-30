const router = require("express").Router();
const Track = require("../models/Track.model");
const User = require("../models/User.model");
const Playlist = require("../models/Playlist.model");

router.post("/playlist", async (req, res, next) => {
  const { description, image, name, user, filename, popularity } = req.body;
  const createPlaylistDB = await Playlist.create({
    description,
    image,
    name,
    user,
    filename,
    popularity,
    track: [],
    user: []
  });

  res.status(201).json({ createPlaylistDB });
      console.log("show create playlist",createPlaylistDB )
     
});

router.get("/playlist/playlistId/", async (req, res, next) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    res.status(400).json({ message: "Playlist Id is not valid" });
  }

  const getPlaylistbyIdDB = await Playlist.findById(playlistId).populate("track");
  res.status(200).json(getPlaylistbyIdDB);
});



router.put("/playlist/playlistId", async(req, res, next) => {
  try {
    const {playlistId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
      }
     
    const playlistUpdateByid= await Playlist.findByIdAndUpdate(playlistId, req.body, {new: true})
    res.status(200).json(playlistUpdateByid);
  } catch (err) {
    console.log("====through playlist findbyIdandupdate error  ====there we go==>", err);
  }
});

router.delete("/playlist/playlistId", async (req, res, next) => {
  try {
    const playlistId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
      }
      const findanddeleteDB = await Playlist.findByIdAndRemove(playlistId)
      res.status(200).json(findanddeleteDB);
      
  } catch (err) {
    console.log("====through playlist error ====there we go==>", err);
  }
});
module.exports = router;
