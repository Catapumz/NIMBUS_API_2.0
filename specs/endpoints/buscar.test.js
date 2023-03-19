const { app } = require("../../src/app");
const mongoose = require("mongoose");
const request = require("supertest");
const Bloques_Vias = require("../../src/models/Bloques_vias");

describe("Buscar", () => {
  const iti_prueba = {
    name: "via prueba",
    autor: "hector",
    dificultad: 215151515,
    comentario: "hola",
    presas: ['"20,255","21,255"'],
    quepared: 15,
    isbloque: "Bloque",
  };

  beforeAll(async () => {
    mongoose.set("strictQuery", true);
    await mongoose.connect("mongodb://mongo:3010/test");
    await Bloques_Vias.deleteMany({});
    await request(app).post("/guardar").send(iti_prueba).expect(200);
  });

  afterAll(async () => {
    await Bloques_Vias.deleteMany({});
    await mongoose.connection.close();
  });

  it("Retrieves", async () => {
    const busqueda = {
      buscar: "hec",
      quepared: 15,
    };
    const result1 = await request(app)
      .get("/buscar")
      .send(busqueda)
      .expect(200);
    expect(result1.body.vias.length).toEqual(1);
  });
});
