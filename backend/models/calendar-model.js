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
        _id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
        nickname: { type: String, required: true, maxlength: 10 },
        role: { type: String, maxlength: 10 },
        administrator: { type: Boolean, default: false },
      },
    ],
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    fixedEvents: [
      {
        _id: { type: mongoose.Types.ObjectId },
        startTime: {
          type: Date,
          required: true,
        },
        endTime: {
          type: Date,
          required: true,
        },
        memberCount: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Calendar", calendarSchema);
