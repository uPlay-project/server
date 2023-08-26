const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
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
        type: Schema.Types.objectId,
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
        type: Schema.Types.objectId,
        ref: "Track",
      },
    ]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Playlist = model("Playlist", playlistSchema);

module.exports = Playlist;
