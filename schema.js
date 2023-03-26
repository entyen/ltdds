const mongoose = require("mongoose");

const user = new mongoose.Schema({
  discordID: { type: String, required: true, unique: true },
  passport: { type: Number, required: true, unique: true, min: 0, max: 999999 },
  access: { type: Number, default: 0 }
});

module.exports = { user }