const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const conexion = async () => {
  //await mongoose.connect("mongodb://127.0.0.1:27017/NIMBUS");
  await mongoose.connect("mongodb://mongo:3010/NIMBUS"); // esto para amazon
  console.log(
    "connectado correctamente a la base de datos de NIMBUSWALLS/VUIT"
  );
};

module.exports = {
  conexion,
};
