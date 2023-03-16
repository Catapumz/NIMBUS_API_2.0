const Bloques_vias = require("../models/Bloques_vias");

const consulta = async (req, res) => {
  let { buscar } = req.body;
  //{ "buscar": "aqui la busqueda"} asi es como se pasa
  let consulta = await Bloques_vias.find({
    $or: [
      { autor: { $regex: buscar, $options: "i" } },
      { name: { $regex: buscar, $options: "i" } },
    ],
  }).exec((error, bloques) => {
    return res.status(200).json({
      status: "Éxito, aquí está tu búsqueda",
      vias: bloques,
    });
  });
};

module.exports = { consulta };
