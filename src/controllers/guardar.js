const validator = require("validator");
const Bloques_Vias = require("../models/Bloques_vias");

const crear = (req, res) => {
  //Recoger parametros por post a guardar
  let parametros = req.body; //indica que reqest el body, osea que lo pide

  //Validar datos
  //   try {
  //     let validar_title =
  //       !validator.isEmpty(parametros.nombre) &&
  //       validator.isLength(parametros.nombre, { min: 5, max: 15 }); //esto quiere decir que si está vacio o si es esta fuera del rango 5-15 letras validar-title va a ser true
  //     let validar_content = !validator.isEmpty(parametros.content);

  //     if (!validar_title || !validar_content) {
  //       //no funciona
  //       throw new Error("No se ha validado la información!!");
  //     }
  //   } catch (error) {
  //     //     return res.status(400).json({
  //     //       status: "error",
  //     //       mensaje: "Faltan datos por enviar",
  //     //     });
  //   }

  //Crear el objeto a guardar
  const articulo = new Bloques_Vias(parametros);

  //Asignar valores a objeto basado en el modelo (manual o automatico)
  //articulo.titulo = parametros.titulo; // esto es si hay pocos datos, es el cas del roco

  //Guardar el articulo en la base de datos
  const callback = (error, articuloGuardado) => {
    // error y articulo guardado me lo devuelve la función save || !articuloGuardado
    if (error || !articuloGuardado) {
      console.debug("error");

      return res.status(400).json({
        status: "error",
        mensaje: "No se ha guardado el itinerario",
      });
    }

    //Devolver resultado
    return res.status(200).json({
      itinerario: articuloGuardado,
      mensaje: "Itinerario creado con exito",
    });
  };

  articulo.save(callback); //ejecuto la función save sobre un objeto definid previamente, por que la funcion save esta definida en schema, que es de donde hereda los atributos la clase
  //};
};

module.exports = { crear }; //esto es un comentaro de prueba de git
