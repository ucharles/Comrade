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
    owner: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
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
                image: { type: String },
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
                image: { type: String },
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
                image: { type: String },
                nickname: { type: String, required: true },
                administrator: { type: Boolean, default: false },
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Calendar", calendarSchema);
