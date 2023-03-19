const Article = require("../models/Bloques_vias");

const borrar = async (req, res) => {
  // recoge el id
  let id = req.params.id;

  //borra con el id seleccionado
  Article.findByIdAndDelete(id, (error, articuloBorrado) => {
    if (error || !articuloBorrado) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se ha enkontrado el itinerario",
      });
    }

    return res.status(200).json({
      Mensaje: "itinerario eliminado con éxito",
      articuloBorrado,
    });
  });
};

module.exports = { borrar };
