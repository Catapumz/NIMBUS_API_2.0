// await Bloques_Vias.updateMany(
//     {},
//      { $set: { dateCreation: ISODate("2023-03-23") } }
//   )
//  const fecha = "2023-" + i1 + "-" + j1;

const Bloques_vias = require("../../models/Bloques_vias");
const { ala } = require("./yearfunction");

const endpoint = async (req, res) => {
  const bloques = await Bloques_vias.find({});
  fechas = ala(bloques.length);

  await Bloques_vias.updateMany(
    {},
    { $set: { dateCreation: ISODate(fechas) } }
  );

  const bloques1 = await Bloques_vias.find({});
  return res.status(200).json({
    bloques1,
  });
};

module.exports = { endpoint };
