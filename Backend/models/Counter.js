const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Nombre del contador
  seq: { type: Number, default: 0 }, // Valor actual del contador
});

const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;