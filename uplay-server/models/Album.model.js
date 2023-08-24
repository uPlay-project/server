const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const albumSchema = new Schema(
  {
    total_tracks: {
      type: Number,
      required: [true, "total track is required."],
    },
    image: {
      type: [String],
      required: [true, "Image is required."],
    },
    title: {
      type: String,
      required: [true, "title is required."],
    },
    release_date: {
      type: Number,
    },
    release_date_precision: {
      type: Number,
    },
    genre: {
      type: [String],
    },
    popularity: {
      type: Number,
    },
    artist: [
      {
        type: Schema.Types.ObjectId, 
        ref: "Artist",
      },
    ],

    album_type: {
      type: String,
    },

    track: [
      {
        type: Schema.Types.ObjectId, 
        ref: "Track",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Album = model("Album", albumSchema);

module.exports = Album;
