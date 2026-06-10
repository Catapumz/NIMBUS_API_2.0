// Uso: node scripts/merge_vias.js <ruta_al_json>
// El JSON debe ser el export del otro servidor: mongoexport --collection=Bloques_Vias --out=vias_remoto.json
// Añade al MongoDB local las vías que falten, comparando por name + quepared

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const BloqueVia = require("../src/models/Bloques_vias");

// Convierte formato extendido de MongoDB ({ $oid, $numberLong, $date... }) a valores nativos
function normalizar(obj) {
  if (Array.isArray(obj)) return obj.map(normalizar);
  if (obj && typeof obj === "object") {
    if ("$oid" in obj) return obj.$oid;
    if ("$numberLong" in obj) return Number(obj.$numberLong);
    if ("$date" in obj) return new Date(obj.$date);
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, normalizar(v)]));
  }
  return obj;
}

const MONGO_URI = "mongodb://mongo:3010/NIMBUS";

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error("Uso: node scripts/merge_vias.js <ruta_al_json>");
    process.exit(1);
  }

  const fullPath = path.resolve(jsonPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`No se encuentra el archivo: ${fullPath}`);
    process.exit(1);
  }

  // mongoexport genera un JSON por línea (JSONL), no un array
  const raw = fs.readFileSync(fullPath, "utf8").trim();
  let remotas;
  try {
    // Intentar array JSON normal
    remotas = JSON.parse(raw);
  } catch {
    // JSONL: una línea = un documento
    remotas = raw.split("\n").map((line) => JSON.parse(line));
  }

  console.log(`Vías en el archivo remoto: ${remotas.length}`);

  await mongoose.connect(MONGO_URI);
  console.log("Conectado a MongoDB local");

  let insertadas = 0;
  let omitidas = 0;

  for (const viaRaw of remotas) {
    const via = normalizar(viaRaw);
    const oidStr = via._id?.toString() ?? null;

    const existe = await BloqueVia.findOne({
      $or: [
        ...(oidStr ? [{ _id: oidStr }] : []),
        { name: via.name, quepared: via.quepared },
      ],
    });

    if (existe) {
      omitidas++;
      continue;
    }

    // Descartar el _id remoto — Mongo asigna uno nuevo en local
    const { _id, __v, ...datos } = via;
    await BloqueVia.create(datos);
    insertadas++;
    console.log(`  + Insertada: "${via.name}" (${via.quepared})`);
  }

  console.log(`\nResumen:`);
  console.log(`  Insertadas : ${insertadas}`);
  console.log(`  Ya existían: ${omitidas}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
