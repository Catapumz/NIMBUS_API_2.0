const express = require("express");
const router = express.Router();

const { consulta } = require("../controllers/buscar");

// Rutas de pruebas
router.get("/buscar", consulta);

module.exports = router;
