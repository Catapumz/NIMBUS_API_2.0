// Uso: node scripts/sync_fotos.js
// Compara los documentos de la colección Fotos con los archivos físicos en /fotos/
// y descarga del servidor remoto los que falten

const mongoose = require("mongoose");
const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require("path");
const Foto = require("../src/models/Foto");

const MONGO_URI = "mongodb://mongo:3010/NIMBUS";
const REMOTE_BASE = "http://35.180.113.93:3000";
const FOTOS_DIR = "/usr/app/fotos";

function descargar(url, destino) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(destino);
    proto.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destino);
        return reject(new Error(`HTTP ${res.statusCode} para ${url}`));
      }
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", (err) => {
      file.close();
      if (fs.existsSync(destino)) fs.unlinkSync(destino);
      reject(err);
    });
  });
}

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Conectado a MongoDB local\n");

  const fotos = await Foto.find({});
  console.log(`Documentos en colección Fotos: ${fotos.length}`);

  let descargadas = 0;
  let yaExisten = 0;
  let errores = 0;

  for (const foto of fotos) {
    const filePath = path.join(FOTOS_DIR, foto.nombre_guardado);

    if (fs.existsSync(filePath)) {
      yaExisten++;
      continue;
    }

    const url = `${REMOTE_BASE}/descargar_foto?file=${encodeURIComponent(foto.nombre_guardado)}`;
    process.stdout.write(`  Descargando: ${foto.nombre_guardado} ... `);

    try {
      await descargar(url, filePath);
      console.log("OK");
      descargadas++;
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      errores++;
    }
  }

  console.log(`\nResumen:`);
  console.log(`  Ya existían : ${yaExisten}`);
  console.log(`  Descargadas : ${descargadas}`);
  console.log(`  Errores     : ${errores}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
