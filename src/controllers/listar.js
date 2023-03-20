const Bloques_vias = require("../models/Bloques_vias");
const ndificultad = require("./convertir_dificultad");

const consulta = async (req, res) => {
  const { isbloque, quepared } = req.query;
  const dificultad = ndificultad[req.query.dificultad];
  if (Array.isArray(dificultad) == true) {
    console.log("dificultad");
    console.log(req.query.dificultad);
    //if (dificultad==dificultad[])
    const query1 = {
      dificultad: dificultad[0],
      isbloque,
      quepared,
    };
    console.log(query1);

    const query2 = {
      dificultad: dificultad[1],
      isbloque,
      quepared,
    };
    console.log(query2);

    Object.keys(query1).forEach(
      (key) => query1[key] === undefined && delete query1[key]
    );

    Object.keys(query2).forEach(
      (key) => query2[key] === undefined && delete query2[key]
    );

    const bloques = (await Bloques_vias.find(query1)).concat(
      await Bloques_vias.find(query2)
    );
    //const bloques = await Bloques_vias.find(query1);

    return res.status(200).json({
      vias: bloques,
    });
  } else {
    const query = {
      dificultad,
      isbloque,
      quepared,
    };
    console.log(query);

    Object.keys(query).forEach(
      (key) => query[key] === undefined && delete query[key]
    );

    const bloques = await Bloques_vias.find(query);
    return res.status(200).json({
      vias: bloques,
    });
  }
};

module.exports = { consulta };
