const express = require("express");
const router = express.Router();

const { listarLayouts } = require("../controllers/listar_layouts");

// GET /listar_layouts/:quepared
router.get("/listar_layouts/:quepared", listarLayouts);

module.exports = router;
