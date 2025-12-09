const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { subirApk } = require("../controllers/subir_apk");

// Configuración de multer (dónde guardar y con qué nombre)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // carpeta montada en docker-compose
    cb(null, "/usr/app/apks");
  },
  filename(req, file, cb) {
    // guardamos el nombre original (ej: nimbus_v1.5.apk)
    cb(null, file.originalname);
  },
});

// Filtro para aceptar solo .apk
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".apk") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos .apk"));
  }
};

// límite de tamaño opcional (200 MB por si acaso)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 },
});

// Ruta para subir apk
// Se envía por POST a /subir_apk con form-data campo "apk"
router.post("/subir_apk", upload.single("apk"), subirApk);

module.exports = router;
