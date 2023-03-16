const express = require("express");
const router = express.Router();

const { consulta } = require("../controllers/listar");

// Rutas de pruebas
router.get("/listar", consulta);

module.exports = router;
