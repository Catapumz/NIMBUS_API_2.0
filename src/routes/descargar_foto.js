const express = require("express");
const router = express.Router();
const { descargarFoto } = require("../controllers/descargar_foto");

// Descargar foto:  GET /descargar_foto?file=nombre.jpg
router.get("/descargar_foto", descargarFoto);

module.exports = router;
