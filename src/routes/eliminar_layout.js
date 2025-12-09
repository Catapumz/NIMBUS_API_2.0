const express = require("express");
const router = express.Router();

const { eliminarLayout } = require("../controllers/eliminar_layout");

// DELETE /eliminar_layout/:id
router.delete("/eliminar_layout/:id", eliminarLayout);

module.exports = router;
