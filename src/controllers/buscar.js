const Bloques_vias = require("../models/Bloques_vias");

const consulta = async (req, res) => {
  let { buscar } = req.query;
  let { quepared } = req.query;

  //{ "buscar": "aqui la busqueda"} asi es como se pasa
  let consulta = await Bloques_vias.find({
    $or: [
      { autor: { $regex: buscar, $options: "i" } },
      { name: { $regex: buscar, $options: "i" } },
    ],
    quepared: quepared,
  }).exec((error, bloques) => {
    return res.status(200).json({
      status: "Éxito, aquí están los resultados de tu búsqueda",
      vias: bloques,
    });
  });
};

module.exports = { consulta };
