const Layouts = require("../models/layouts");

const listarLayouts = async (req, res) => {
  try {
    const { quepared } = req.params; // /listar_layouts/:quepared

    if (!quepared) {
      return res.status(400).json({
        status: "error",
        mensaje: "Debes indicar 'quepared' en la URL",
      });
    }

    const layouts = await Layouts.find({ quepared })
      .populate(
        "foto_id",
        "nombre_original nombre_guardado tamano_bytes url_publica dateCreation"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "ok",
      total: layouts.length,
      layouts,
    });
  } catch (err) {
    console.error("Error listando layouts:", err);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno obteniendo los layouts",
    });
  }
};

module.exports = { listarLayouts };
