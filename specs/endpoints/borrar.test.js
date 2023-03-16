const { app } = require("../../src/app");
const mongoose = require("mongoose");
const request = require("supertest");
const Bloques_Vias = require("../../src/models/Bloques_vias");

describe("Borrar", () => {
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
    const result1 = await request(app).get("/listar").expect(200);
    expect(result1.body.vias.length).toEqual(1);

    const id = result1.body.vias[0]._id;

    const url = "/borrar/" + id;

    await request(app).delete(url).expect(200);

    const result = await request(app).get("/listar").expect(200);

    expect(result.body.vias.length).toEqual(0);
  });
});
