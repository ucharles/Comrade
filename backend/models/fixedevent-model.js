const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fixedeventSchema = new Schema({
  title: { type: String, required: true },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  calendar: { type: mongoose.Types.ObjectId, required: true, ref: "Calendar" },
});

module.exports = mongoose.model("Fixedevent", fixedeventSchema);
