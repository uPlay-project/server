const router = require("express").Router();
const { MongoClient, ObjectID } = require("mongodb");

const MONGO_URI = process.env.MONGODB_URI;

const client = new MongoClient(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fetchEverything() {
  try {
    await client.connect();
    const db = client.db();

  
    const results = await db.collection("track").aggregate([
      {
        $lookup: {
          from: "album",
          localField: "albumId",
          foreignField: "_id",
          as: "album",
        },
      },
      {
        $lookup: {
          from: "artist",
          localField: "album.artistId",
          foreignField: "_id",
          as: "artist",
        },
      },
      {
        $unwind: "$album",
      },
      {
        $unwind: "$artist",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          "album.name": 1,
          "artist.name": 1,
        },
      },
    ]).toArray();

    return results;
  } catch (err) {
    console.error("Error while fetching data:", err);
    throw err;
  } finally {
    await client.close();
  }
}

router.get("/search", async (req, res) => {
  try {
    const results = await fetchEverything();
    res.json(results);
  } catch (err) {
    console.error("Error while retrieving data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
