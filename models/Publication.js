const { Schema, model } = require("mongoose");

const publicationSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  {
    timestamps: true,
  }
);

const Publication = model("Publication", publicationSchema);

module.exports = Publication;
