const Bloques_vias = require("../../models/Bloques_vias");
const { ala } = require("./yearfunction");

const endpoint = async (req, res) => {
  const bloques = await Bloques_vias.find({});
  fechas = ala(bloques.length);

  await Promise.all(
    bloques.map(async (bloque, index) => {
      await Bloques_vias.updateOne(
        { _id: bloque._id },
        { $set: { dateCreation: fechas[index] } }
      );
    })
  );
  const bloquess = await Bloques_vias.find({});
  return res.status(200).json({
    bloquess,
  });
};

module.exports = { endpoint };
