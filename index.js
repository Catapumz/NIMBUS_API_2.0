//Inicializar app
const { conexion } = require("./src/conexion"); //importamos función conexion del archivo conexion(previamente la exportamos en este archivo)
const { app } = require("./src/app");

const PORT = 3000;

async function main() {
  console.log("App de node arrancada");

  //Conectar a la base de datos
  await conexion();

  app.listen(PORT, () =>
    console.log("Servidor corriendo en el puerto " + PORT)
  );
}

main();
