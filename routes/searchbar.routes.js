const express = require("express");
const router = express.Router();
const Album = require("../models/Album.model");
const Artist = require("../models/Artist.model");
const Track = require("../models/Track.model");

router.get("/search", async (req, res) => {
  const searchTerm = req.query.term;

  if (!searchTerm) {
    return res.status(400).json({ error: "Search term is required" });
  }

  console.log("Received search request with term:", searchTerm);
  try {
    const albums = await Album.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    const tracks = await Track.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    const artists = await Artist.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    const results = {
      albums,
      tracks,
      artists,
    };

    res.status(200).json({ data: results });
  } catch (err) {
    console.error("Error while retrieving data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;













// const { MongoClient } = require("mongodb");
// const express = require("express");
// const router = express.Router();

// const MONGO_URI = process.env.MONGODB_URI;

// const client = new MongoClient(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// async function fetchEverything(searchTerm) {
//   try {
//     await client.connect();
//     const db = client.db();

//     const results = await db.collection("track").aggregate([
      
//       {
//         $match: {
//           $text: {
//             $search: searchTerm, // This will filter based on the searchTerm.
//           },
//         },
//       },
//     ]).toArray();

//     return results;
//   } catch (err) {
//     console.error("Error while fetching data:", err);
//     throw err;
//   } finally {
//     await client.close();
//   }
// }

// router.get("/search", async (req, res) => {
//   const searchTerm = req.query.term;
//   console.log("Received search request with term:", searchTerm);
//   try {
//     const results = await fetchEverything(searchTerm);
//     if (results.length === 0) {
//       res.status(404).json({ message: "No results found" });
//     } else {
//       res.status(200).json({ data: results });
//     }
//   } catch (err) {
//     console.error("Error while retrieving data:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;
