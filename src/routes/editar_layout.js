const express = require("express");
const router = express.Router();

const { editarLayout } = require("../controllers/editar_layout");

// PUT /editar_layout/:id
router.put("/editar_layout/:id", editarLayout);

module.exports = router;
