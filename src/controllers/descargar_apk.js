const path = require("path");
const fs = require("fs");

const consulta = async (req, res) => {
  try {
    let { file, version } = req.query;

    // 1) Si NO se pasa "file", construimos el nombre según "version"
    if (!file) {
      // Valor por defecto: latest
      if (!version || version === "latest") {
        file = "nimbus_apk_latest_server.apk";
      } else {
        // Esperamos version = "1", "2" o "3"
        const n = parseInt(version, 10);

        if (![1, 2, 3].includes(n)) {
          return res.status(400).json({
            status: "error",
            mensaje: "Versión no válida. Usa ?version=latest, 1, 2 o 3",
          });
        }

        file = `nimbus_apk_n-${n}.apk`;
      }
    }

    const baseDir = "/usr/app/apks"; // o la que uses
    const filePath = path.join(baseDir, file);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: "error",
        mensaje: "El archivo solicitado no existe en el servidor",
        fileIntentado: filePath,
      });
    }

    // 👇 AQUÍ VIENE EL CAMBIO IMPORTANTE
    res.download(filePath, file, (err) => {
      if (err) {
        // El cliente ha abortado la conexión (cerró pestaña, canceló descarga, etc.)
        if (err.code === "ECONNABORTED" || err.code === "ECONNRESET") {
          console.warn("El cliente canceló la descarga:", err.message);
          return; // No intentamos responder nada, ya no tiene sentido
        }

        // Si ya se han enviado las cabeceras, NO se puede mandar JSON
        if (res.headersSent) {
          console.error(
            "Error al descargar el archivo después de enviar las cabeceras:",
            err
          );
          return;
        }

        console.error("Error al descargar el archivo:", err);
        return res.status(500).json({
          status: "error",
          mensaje: "Error al descargar el archivo",
        });
      } else {
        console.log(`Descarga de ${file} completada correctamente.`);
      }
    });
  } catch (error) {
    console.error("Error en la descarga:", error);

    // Por si acaso, solo respondemos si no se ha enviado nada aún
    if (!res.headersSent) {
      return res.status(500).json({
        status: "error",
        mensaje: "Error interno del servidor",
      });
    }
  }
};

module.exports = { consulta };
