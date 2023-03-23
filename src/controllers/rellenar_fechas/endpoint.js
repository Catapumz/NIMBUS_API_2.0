// await Bloques_Vias.updateMany(
//     {},
//      { $set: { dateCreation: ISODate("2023-03-23") } }
//   )
//  const fecha = "2023-" + i1 + "-" + j1;

const Bloques_vias = require("../../models/Bloques_vias");

const endpoint = async (req, res) => {
  const bloques = await Bloques_vias.find(query);
  return res.status(200).json({
    vias: bloques,
  });
};

module.exports = { endpoint };
