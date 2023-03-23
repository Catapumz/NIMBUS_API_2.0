// await Bloques_Vias.updateMany(
//     {},
//      { $set: { dateCreation: ISODate("2023-03-23") } }
//   )
//  const fecha = "2023-" + i1 + "-" + j1;

const Bloques_vias = require("../../models/Bloques_vias");

const endpoint = async (req, res) => {
  await Bloques_vias.find({}).exec((error, bloques) => {
    // ejecuto.find sobre una CLASE Bloques_vias, bloques es un array con objetos

    return res.status(200).json({
      status: "Éxito, aquí están los itinerarios de la pared de 15",
      vias: bloques,
    });
  });
};

module.exports = { endpoint };
