const express = require("express");
const router = express.Router();

const { eliminarFoto } = require("../controllers/eliminar_foto");

// DELETE /eliminar_foto/:id
router.delete("/eliminar_foto/:id", eliminarFoto);

module.exports = router;
