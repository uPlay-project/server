const { Schema, model } = require("mongoose");

const playlistSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "description is required."],
    },
    image: {
      type: [String],
      required: [true, "Image is required."],
    },
    name: {
      type: String,
    },
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    filename: {
      type: String,
    },
    popularity: {
      type: Number,
    },
    track: [
      {
        type: Schema.Types.ObjectId,
        ref: "Track",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Playlist = model("Playlist", playlistSchema);

module.exports = Playlist;
