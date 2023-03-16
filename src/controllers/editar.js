const Bloques_Vias = require("../models/Bloques_vias");

const editar = (req, res) => {
  let articuloId = req.params.id;

  let parametros = req.body;

  Bloques_Vias.findOneAndUpdate(
    { id: articuloId },
    parametros,
    { new: true },
    (error, articuloActualizado) => {
      return res.status(200).json({
        status: "success",
        itinerario: articuloActualizado,
      });
    }
  );
};

module.exports = { editar };
