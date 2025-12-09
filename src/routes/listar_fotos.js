const express = require("express");
const router = express.Router();

const { listarFotos } = require("../controllers/listar_fotos");

// GET /listar_fotos/:quepared
router.get("/listar_fotos/:quepared", listarFotos);

module.exports = router;
