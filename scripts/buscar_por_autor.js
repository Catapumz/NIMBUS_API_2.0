const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:3011/NIMBUS";

const AUTOR = process.argv[2];

if (!AUTOR) {
  console.error("Uso: node scripts/buscar_por_autor.js <nombre>");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Conectado a MongoDB");

  const vias = await mongoose.connection.db
    .collection("Bloques_Vias")
    .find({ autor: { $regex: new RegExp(`^${AUTOR}$`, "i") } })
    .toArray();

  console.log(`Vías encontradas: ${vias.length}`);
  console.log(vias);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
