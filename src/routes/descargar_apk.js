const express = require("express");
const router = express.Router();

const { consulta } = require("../controllers/descargar_apk");

// Rutas de pruebas
router.get("/descargar", consulta);

module.exports = router;
