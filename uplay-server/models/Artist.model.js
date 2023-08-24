const { Schema, model } = require("mongoose");

const artistSchema = new Schema(
  {
    name: {
        type: String,
      },

    genre: {
      type: [String],
      required: [true, "description is required."],
    },
    image: {
      type: [String],
      required: [true, "Image is required."],
    },

    popularity: {
      type: Number,
    },
   
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Artist = model("Artist", artistSchema);

module.exports = Artist;
