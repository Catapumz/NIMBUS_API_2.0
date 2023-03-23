const express = require("express"); //asignamos a express las funciones de la libreria express
const cors = require("cors"); // lo mismo que arriba pero conn cors
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("../swagger.json");

const routes_listar = require("./routes/listar");
const routes_guardar = require("./routes/guardar");
const routes_borrar = require("./routes/borrar");
const routes_editar = require("./routes/editar");
const routes_buscar = require("./routes/buscar");

const routes_endpoint = require("./routes/endpoint");

//Crear servidor Node
const app = express();

//Configurar cors
app.use(cors()); //middleware (?)

//Convertir body a objeto js
app.use(express.json()); //recibir datos con content-type app/json
app.use(express.urlencoded({ extended: true })); //recibir datos form-urlencoded

//rutas relacionadas con las vias
app.use("/", routes_listar);
app.use("/", routes_guardar);
app.use("/", routes_borrar);
app.use("/", routes_editar);
app.use("/", routes_buscar);
app.use("/", routes_endpoint);

//rutas documentacion
app.use("/documentacion", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = { app };
