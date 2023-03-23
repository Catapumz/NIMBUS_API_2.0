const express = require("express");
const router = express.Router();

const { endpoint } = require("../controllers/rellenar_fechas/endpoint");

// Rutas de pruebas
router.get("/end", endpoint);

module.exports = router;
