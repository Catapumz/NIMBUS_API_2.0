const express = require("express");
const router = express.Router();

const { nuevoLayout } = require("../controllers/nuevo_layout");

// POST /nuevo_layout
router.post("/nuevo_layout", nuevoLayout);

module.exports = router;
