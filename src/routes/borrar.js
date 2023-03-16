const express = require("express");
const router = express.Router();

const { borrar } = require("../controllers/borrar");

// Rutas de pruebas
router.delete("/borrar/:id?", borrar);

module.exports = router;
