const express = require("express");
const router = express.Router();

const { crear } = require("../controllers/guardar");

// Rutas de pruebas
router.post("/guardar", crear);

module.exports = router;
