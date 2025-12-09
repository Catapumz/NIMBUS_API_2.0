const Foto = require("../models/Foto");
const fs = require("fs");

const eliminarFoto = async (req, res) => {
  try {
    const { id } = req.params; // id del documento en Mongo

    if (!id) {
      return res.status(400).json({
        status: "error",
        mensaje: "Debes indicar el id de la foto",
      });
    }

    // 1. Buscamos la foto en Mongo
    const foto = await Foto.findById(id);

    if (!foto) {
      return res.status(404).json({
        status: "error",
        mensaje: "Foto no encontrada",
      });
    }

    // 2. Borramos el archivo del disco (si existe)
    if (fs.existsSync(foto.ruta_interna)) {
      fs.unlinkSync(foto.ruta_interna);
    }

    // 3. Borramos el documento de Mongo
    await Foto.findByIdAndDelete(id);

    return res.status(200).json({
      status: "ok",
      mensaje: "Foto y registro eliminados correctamente",
    });
  } catch (err) {
    console.error("Error eliminando foto:", err);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno eliminando la foto",
    });
  }
};

module.exports = { eliminarFoto };
