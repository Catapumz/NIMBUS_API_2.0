const Bloques_Vias = require("../models/Bloques_vias");

const editar = (req, res) => {
  let articuloId = req.params.id;

  let parametros = req.body;

  Bloques_Vias.findOneAndUpdate(
    { id: articuloId },
    parametros,nananaaaaaaa
    { new: true },
    (error, articuloActualizado) => {
      return res.status(200).json({
        itinerario: articuloActualizado,
        mensaje: "Itinerario actualizado con exito",
      });
    }
  );
};

module.exports = { editar };
