const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const calendarSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 15 },
    description: { type: String, maxlength: 50 },
    image: {
      type: String,
    },
    members: [
      {
        userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
        nickname: { type: String, required: true, maxlength: 10 },
        role: { type: String, maxlength: 10 },
        administrator: { type: Boolean, default: false },
      },
    ],
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Calendar", calendarSchema);
