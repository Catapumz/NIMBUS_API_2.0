const Layouts = require("../models/layouts");

const eliminarLayout = async (req, res) => {
  try {
    const { id } = req.params; // id del layout

    if (!id) {
      return res.status(400).json({
        status: "error",
        mensaje: "Debes indicar el id del layout",
      });
    }

    const layout = await Layouts.findById(id);

    if (!layout) {
      return res.status(404).json({
        status: "error",
        mensaje: "Layout no encontrado",
      });
    }

    await Layouts.findByIdAndDelete(id);

    return res.status(200).json({
      status: "ok",
      mensaje: "Layout eliminado correctamente",
      // opcional: devolver info del que se ha borrado
      layout_eliminado: layout,
    });
  } catch (err) {
    console.error("Error eliminando layout:", err);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno eliminando el layout",
    });
  }
};

module.exports = { eliminarLayout };
