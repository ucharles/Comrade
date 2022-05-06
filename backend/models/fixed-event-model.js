const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fixedEventSchema = new Schema(
  {
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    depth: { type: Number, required: true },
    members: [
      {
        intersection: [
          {
            id: {
              type: mongoose.Types.ObjectId,
              required: true,
              ref: "User",
            },
            nickname: { type: String, required: true },
            administrator: { type: Boolean, default: false },
          },
        ],
        noIntersection: [
          {
            id: {
              type: mongoose.Types.ObjectId,
              required: true,
              ref: "User",
            },
            nickname: { type: String, required: true },
            administrator: { type: Boolean, default: false },
          },
        ],
        noEvent: [
          {
            id: {
              type: mongoose.Types.ObjectId,
              required: true,
              ref: "User",
            },
            nickname: { type: String, required: true },
            administrator: { type: Boolean, default: false },
          },
        ],
      },
    ],
    calendar: { type: mongoose.Types.ObjectId, ref: "Calendar" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FixedEvent", fixedEventSchema);
