const Layouts = require("../models/layouts");
const Foto = require("../models/Foto");

const editarLayout = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "error",
        mensaje: "Debes indicar el id del layout en la URL",
      });
    }

    const {
      quepared,
      name,
      ledCount,
      baseWidth,
      baseHeight,
      defaultHoldSize,
      holds,
      foto_id,
    } = req.body;

    // Construimos un objeto solo con lo que llegue en el body
    const updateData = {};

    if (quepared !== undefined) updateData.quepared = quepared;
    if (name !== undefined) updateData.name = name;
    if (ledCount !== undefined) updateData.ledCount = ledCount;
    if (baseWidth !== undefined) updateData.baseWidth = baseWidth;
    if (baseHeight !== undefined) updateData.baseHeight = baseHeight;
    if (defaultHoldSize !== undefined)
      updateData.defaultHoldSize = defaultHoldSize;
    if (holds !== undefined) updateData.holds = holds;

    // Si nos pasan una nueva foto, actualizamos foto_id + foto_url_publica
    if (foto_id) {
      const foto = await Foto.findById(foto_id);

      if (!foto) {
        return res.status(404).json({
          status: "error",
          mensaje: "La nueva foto indicada no existe",
        });
      }

      updateData.foto_id = foto._id;
      updateData.foto_url_publica = foto.url_publica;
    }

    const layoutActualizado = await Layouts.findByIdAndUpdate(id, updateData, {
      new: true, // devuelve el documento actualizado
    });

    if (!layoutActualizado) {
      return res.status(404).json({
        status: "error",
        mensaje: "Layout no encontrado",
      });
    }

    return res.status(200).json({
      status: "ok",
      mensaje: "Layout actualizado correctamente",
      layout: layoutActualizado,
    });
  } catch (err) {
    console.error("Error editando layout:", err);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno editando el layout",
    });
  }
};

module.exports = { editarLayout };
