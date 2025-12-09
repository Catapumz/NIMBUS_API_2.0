// src/models/Foto.js
const { Schema, model } = require("mongoose");

const FotoSchema = Schema({
  quepared: {
    type: String,
    required: true,
  },

  nombre_original: {
    type: String,
    required: true,
  },

  nombre_guardado: {
    type: String,
    required: true,
  },

  tamano_bytes: {
    type: Number,
    required: true,
  },

  ruta_interna: {
    type: String,
    required: true,
  },

  url_publica: {
    type: String,
    required: true,
  },

  dateCreation: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Fotos", FotoSchema, "Fotos");
