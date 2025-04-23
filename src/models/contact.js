const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  nombre: String,
  correo: String,
  ciudad: String,
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contact", contactSchema);
