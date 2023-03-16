const { app } = require("../../src/app");
const mongoose = require("mongoose");
const request = require("supertest");
const Bloques_Vias = require("../../src/models/Bloques_vias");

describe("Guardar", () => {
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
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("Retrieves", async () => {
    await request(app).post("/guardar").send(iti_prueba).expect(200);
    const result = await request(app).get("/listar").expect(200);

    expect(result.body.vias[0].name).toEqual(iti_prueba.name);
    expect(result.body.vias[0].autor).toEqual(iti_prueba.autor);
    expect(result.body.vias[0].dificultad).toEqual(iti_prueba.dificultad);
    expect(result.body.vias[0].comentario).toEqual(iti_prueba.comentario);
    expect(result.body.vias[0].presas).toEqual(iti_prueba.presas);
    expect(result.body.vias[0].quepared).toEqual(iti_prueba.quepared);
    expect(result.body.vias[0].isbloque).toEqual(iti_prueba.isbloque);
  });
});
