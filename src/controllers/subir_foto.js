// src/controllers/subir_foto.js

const Foto = require("../models/Foto");
const path = require("path");
const fs = require("fs");

const subirFoto = async (req, res) => {
  try {
    const { quepared, nombre_guardado } = req.body;

    if (!quepared || !nombre_guardado) {
      return res.status(400).json({
        status: "error",
        mensaje:
          "Faltan campos obligatorios. Debes enviar 'quepared' y 'nombre_guardado'.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        mensaje:
          "No se ha recibido ninguna imagen. Usa el campo 'foto' en form-data.",
      });
    }

    const { originalname, size, path: tempPath } = req.file;

    const dirFotos = path.dirname(tempPath);
    const finalPath = path.join(dirFotos, nombre_guardado);

    // ✅ Comprobación: ¿ya existe?
    if (fs.existsSync(finalPath)) {
      // borramos el archivo temporal que subió multer
      fs.unlinkSync(tempPath);

      return res.status(400).json({
        status: "error",
        mensaje: `Ya existe una imagen con el nombre '${nombre_guardado}'. Elige otro nombre.`,
      });
    }

    // Renombramos el archivo
    fs.renameSync(tempPath, finalPath);

    const fotoData = {
      quepared,
      nombre_original: originalname,
      nombre_guardado,
      tamano_bytes: size,
      ruta_interna: finalPath,
      url_publica: `/fotos/${nombre_guardado}`,
    };

    const nuevaFoto = await Foto.create(fotoData);

    return res.status(200).json({
      status: "ok",
      mensaje: "Imagen subida y guardada correctamente",
      foto: nuevaFoto,
    });
  } catch (err) {
    console.error("Error subiendo imagen:", err);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno guardando la imagen",
    });
  }
};

module.exports = { subirFoto };
