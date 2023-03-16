const Bloques_vias = require("../models/Bloques_vias");
const ndificultad = require("./convertir_dificultad");

const consulta = async (req, res) => {
  const { isbloque, quepared } = req.body;
  const dificultad = ndificultad[req.body.dificultad];
  console.log(isbloque);
  const query = {
    dificultad,
    isbloque,
    quepared,
  };

  Object.keys(query).forEach(
    (key) => query[key] === undefined && delete query[key]
  );

  const bloques = await Bloques_vias.find(query);

  return res.status(200).json({
    vias: bloques,
  });
};

module.exports = { consulta };
