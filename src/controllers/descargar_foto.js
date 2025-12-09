const path = require("path");
const fs = require("fs");

const descargarFoto = async (req, res) => {
  try {
    const { file } = req.query;

    if (!file) {
      return res.status(400).json({
        status: "error",
        mensaje: "Debes indicar el nombre del archivo con ?file=nombre.jpg",
      });
    }

    const baseDir = "/usr/app/fotos"; // misma ruta que en la subida
    const filePath = path.join(baseDir, file);

    // Comprobar que existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: "error",
        mensaje: "La foto solicitada no existe",
        archivo: file,
      });
    }
    //whhOeekklkllljdkdddklddswjhdkjssklklsddjfdsdhslñds-    // Descargar
    return res.download(filePath, file, (err) => {
      if (err) {
        console.error("Error al descargar la imagen:", err);
        return res.status(500).json({
          status: "error",
          mensaje: "Error al descargar la imagen",
        });
      }
    });
  } catch (e) {
    console.error("Error en descarga:", e);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno del servidor",
    });
  }
};

module.exports = { descargarFoto };
