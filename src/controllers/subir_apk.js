const fs = require("fs");
const path = require("path");

const fileExists = async (filePath) => {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const subirApk = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        mensaje:
          "No se ha recibido ninguna APK. Usa el campo 'apk' en form-data.",
      });
    }

    const { originalname, size, path: savedPath } = req.file;

    // Carpeta donde Multer ha guardado la APK
    const dirApks = path.dirname(savedPath);
    const ext = path.extname(savedPath) || ".apk";

    const latestPath = path.join(dirApks, `nimbus_apk_latest_server${ext}`);
    const n1Path = path.join(dirApks, `nimbus_apk_n-1${ext}`);
    const n2Path = path.join(dirApks, `nimbus_apk_n-2${ext}`);
    const n3Path = path.join(dirApks, `nimbus_apk_n-3${ext}`);

    // 1) Borrar n-3 si existe
    if (await fileExists(n3Path)) {
      await fs.promises.unlink(n3Path);
    }

    // 2) n-2 -> n-3
    if (await fileExists(n2Path)) {
      await fs.promises.rename(n2Path, n3Path);
    }

    // 3) n-1 -> n-2
    if (await fileExists(n1Path)) {
      await fs.promises.rename(n1Path, n2Path);
    }

    // 4) latest -> n-1
    if (await fileExists(latestPath)) {
      await fs.promises.rename(latestPath, n1Path);
    }

    // 5) Nueva subida -> latest
    await fs.promises.rename(savedPath, latestPath);

    return res.status(200).json({
      status: "ok",
      mensaje: "APK subida y rotada correctamente",
      nombre_original: originalname,
      tamano_bytes: size,
      archivos_resultantes: {
        latest: path.basename(latestPath),
        n_1: (await fileExists(n1Path)) ? path.basename(n1Path) : null,
        n_2: (await fileExists(n2Path)) ? path.basename(n2Path) : null,
        n_3: (await fileExists(n3Path)) ? path.basename(n3Path) : null,
      },
    });
  } catch (err) {
    console.error("Error subiendo APK:", err);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno guardando/rotando la APK",
    });
  }
};

module.exports = { subirApk };
