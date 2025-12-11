const Bloques_Vias = require("../models/Bloques_vias");

const editar = async (req, res) => {
  let articuloId = req.params.id;

  let parametros = req.body;

  const viaActualizada = await Bloques_Vias.findByIdAndUpdate(
    articuloId,
    parametros,
    { new: true }
  );

  return res.status(200).json({
    itinerario: viaActualizada,
    mensaje: "Itinerario actualizado con exito",
  });
};

module.exports = { editar };
