const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { subirFoto } = require("../controllers/subir_foto");

// Configuración de multer (dónde guardar y con qué nombre)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // carpeta montada en docker-compose
    cb(null, "/usr/app/fotos"); // ⬅ equivalente a apks pero carpeta fotos
  },
  filename(req, file, cb) {
    // renombra con timestamp para no pisar nada
    const ext = path.extname(file.originalname).toLowerCase();
    const nombre = Date.now() + ext;
    cb(null, nombre);
  },
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const permitidas = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

  if (permitidas.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes: .jpg .jpeg .png .webp .gif"));
  }
};

// Máximo 20MB para imágenes (puedes cambiarlo)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// Ruta para subir imágenes
// POST /subir_foto con form-data campo "foto"
router.post("/subir_foto", upload.single("foto"), subirFoto);

module.exports = router;
