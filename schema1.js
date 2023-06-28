const mongoose = require("mongoose");

const state = new mongoose.Schema({
  stateid: { type: String, required: true, unique: true },
  state1: { type: Number, default: 0 },
  state2: { type: Number, default: 0 },
  state3: { type: Number, default: 0 }
});

module.exports = { state }