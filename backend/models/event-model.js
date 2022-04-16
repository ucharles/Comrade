const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    title: { type: String },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
