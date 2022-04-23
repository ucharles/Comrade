const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const inviteSchema = new Schema(
  {
    inviteId: { type: "String", required: true },
    calendarId: { type: "String", required: true },
    expire: { type: "Date", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invite", inviteSchema);
