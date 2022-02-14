const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    creator: { type: mongoose.Types.ObjectId, ref: "User" },
    calendar: { type: mongoose.Types.ObjectId, ref: "Calendar" },
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

module.exports = mongoose.model("Event", eventSchema);
