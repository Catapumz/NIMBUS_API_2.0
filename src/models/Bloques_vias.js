//interactuar con una colección y sus documentos
const { Schema, model } = require("mongoose");

//defino el objeto ()o modelo de la colleción
const Via15Schema = Schema({
  name: {
    type: String,
    required: true,
  },
  autor: {
    type: String,
    required: true,
  },
  dificultad: {
    type: Number,
  },
  comentario: {
    type: String,
    default:
      "Todas nuestras vías siguen el método T.R.A.V.E (Tocas Rojas, Azules, Verdes y Encadenas) \n\n La salida y el top son de color blanco \n\n las amarillas se pueden usar para juntar \n\n Si con esos tres colores no es suficiente, el metodo T-R-A-V-E se puede alargar con el color morado ",
  },
  presas: {
    type: [String],
    //required: true,
  },
  quepared: {
    type: Number,
    required: true,
  },
  isbloque: {
    type: String,
    required: true,
  },
});

module.exports = model("Bloques_Vias", Via15Schema, "Bloques_Vias");
//articulos, la pluraliza automaticamente
