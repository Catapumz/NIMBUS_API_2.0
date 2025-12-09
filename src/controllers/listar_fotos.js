const Foto = require("../models/Foto");

const listarFotos = async (req, res) => {
  try {
    // viene de la URL: /listar_fotos/:quepared
    const { quepared } = req.params;

    if (!quepared) {
      return res.status(400).json({
        status: "error",
        mensaje: "Debes indicar 'quepared' en la URL",
      });
    }

    const fotos = await Foto.find({ quepared })
      .select(
        "quepared nombre_original nombre_guardado tamano_bytes url_publica dateCreation"
      )
      .sort({ dateCreation: -1 });

    return res.status(200).json({
      status: "ok",
      total: fotos.length,
      fotos,
    });
  } catch (err) {
    console.error("Error listando fotos:", err);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno obteniendo las fotos",
    });
  }
};

module.exports = { listarFotos };
