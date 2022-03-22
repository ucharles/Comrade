const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    calendars: [
      { type: mongoose.Types.ObjectId, required: true, ref: "Calendar" },
    ],
    // array를 원할 경우 []를 추가.
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
