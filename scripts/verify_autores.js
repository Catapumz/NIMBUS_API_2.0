const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:3011/NIMBUS";

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Conectado a MongoDB");

  const result = await mongoose.connection.db
    .collection("Bloques_Vias")
    .updateMany(
   { autor: { $regex: /^panxa\s*plena/i } },
      { $set: { isVerified: true } }
    );

  console.log(`Vías actualizadas: ${result.modifiedCount}`);
  console.log(`Vías encontradas:  ${result.matchedCount}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
