const { Schema, model } = require("mongoose");


const trackSchema = new Schema(
  {
    lyrics: {
      type: String,
    },
    popularity: {
      type: Number,
    },

    image: {
      type: [String],
      required: [true, "Image is required"],
    },
    filename: {
      type: [String],
    },
    release_date: {
      type: String,
    },
   
    duration: {
      type: Number,
    },

    // artist: [
    //   {
    //     type: Schema.Types.objectId,
    //     ref: "Artist",
    //   },
    // ],
    genre: {
      type: String,
    },

    track_number: {
      type: Number,
    },
  },

  {
    timestamps: true,
  }
);

const Track = model("Track", trackSchema);

module.exports = Track;
