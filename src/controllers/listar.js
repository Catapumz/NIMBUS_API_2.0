const Bloques_vias = require("../models/Bloques_vias");

const consulta = async (req, res) => {
  const { isbloque, quepared } = req.query;
  const dificultad = req.query.dificultad !== undefined ? Number(req.query.dificultad) : undefined;
  const isVerified = req.query.isVerified !== undefined ? req.query.isVerified === "true" : undefined;

  const query = { dificultad, isbloque, quepared, isVerified };
  Object.keys(query).forEach((key) => query[key] === undefined && delete query[key]);

  const bloques = await Bloques_vias.find(query);
  return res.status(200).json({ vias: bloques });
};

module.exports = { consulta };
