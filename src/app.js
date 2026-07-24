const express = require("express"); //asignamos a express las funciones de la libreria express
const cors = require("cors"); // lo mismo que arriba pero conn cors
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("../swagger.json");
const swaggerUiAssetPath = require("swagger-ui-dist").getAbsoluteFSPath();

const routes_listar = require("./routes/listar");
const routes_guardar = require("./routes/guardar");
const routes_borrar = require("./routes/borrar");
const routes_editar = require("./routes/editar");
const routes_buscar = require("./routes/buscar");
const routes_descargar = require("./routes/descargar_apk");
const routes_subir_foto = require("./routes/subir_foto");
const routes_descargar_foto = require("./routes/descargar_foto");
const routes_listar_fotos = require("./routes/listar_fotos");
const routes_eliminar_foto = require("./routes/eliminar_foto");
const routes_nuevo_layout = require("./routes/nuevo_layout");
const routes_listar_layouts = require("./routes/listar_layouts");
const routes_editar_layout = require("./routes/editar_layout");
const routes_eliminar_layout = require("./routes/eliminar_layout");

const routes_subir_apk = require("./routes/subir_apk");

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
app.use("/", routes_descargar);
app.use("/", routes_subir_apk);
app.use("/", routes_subir_foto);
app.use("/", routes_descargar_foto);
app.use("/", routes_listar_fotos);
app.use("/", routes_eliminar_foto);
app.use("/", routes_nuevo_layout);
app.use("/", routes_listar_layouts);
app.use("/", routes_editar_layout);
app.use("/", routes_eliminar_layout);

//rutas documentacion
app.use("/assets", express.static(swaggerUiAssetPath));
app.use("/documentacion", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = { app };
