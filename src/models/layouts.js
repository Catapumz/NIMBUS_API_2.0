const { Schema, model } = require("mongoose");

// Subdocumento para cada presa
const HoldSchema = new Schema({
  led: {
    type: Number,
    required: true,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  size: {
    type: Number,
    default: null,
  },
});

// Modelo principal
const LayoutsSchema = new Schema(
  {
    quepared: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    ledCount: {
      type: Number,
      required: true,
    },

    baseWidth: {
      type: Number,
      required: true,
    },

    baseHeight: {
      type: Number,
      required: true,
    },

    defaultHoldSize: {
      type: Number,
      default: 36,
    },

    holds: {
      type: [HoldSchema],
      default: [],
    },

    // 🔗 relación con la foto
    foto_id: {
      type: Schema.Types.ObjectId,
      ref: "Fotos",
      required: true,
    },

    // acceso rápido para frontend
    foto_url_publica: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt / updatedAt automáticos
  }
);

module.exports = model("Layouts", LayoutsSchema, "layouts");
