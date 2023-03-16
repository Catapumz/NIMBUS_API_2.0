const { app } = require("../../src/app");
const mongoose = require("mongoose");
const request = require("supertest");
const Bloques_Vias = require("../../src/models/Bloques_vias");

describe("Editar", () => {
  const iti_prueba = {
    name: "via prueba",
    autor: "hector",
    dificultad: 215151515,
    comentario: "hola",
    presas: ['"20,255","21,255"'],
    quepared: 15,
    isbloque: "Bloque",
  };
  const iti2_prueba = {
    name: "via pruebaa",
    autor: "hectorr",
    dificultad: 2151515151,
    comentario: "holaa",
    presas: ['"20,2555","21,2555"'],
    quepared: 155,
    isbloque: "Bloquee",
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
    const id = result1.body.vias[0]._id;

    const url = "/editar/" + id;

    await request(app).put(url).send(iti2_prueba).expect(200);

    const result = await request(app).get("/listar").expect(200);

    expect(result.body.vias[0].name).toEqual(iti2_prueba.name);
    expect(result.body.vias[0].autor).toEqual(iti2_prueba.autor);
    expect(result.body.vias[0].dificultad).toEqual(iti2_prueba.dificultad);
    expect(result.body.vias[0].comentario).toEqual(iti2_prueba.comentario);
    expect(result.body.vias[0].presas).toEqual(iti2_prueba.presas);
    expect(result.body.vias[0].quepared).toEqual(iti2_prueba.quepared);
    expect(result.body.vias[0].isbloque).toEqual(iti2_prueba.isbloque);

    await Bloques_Vias.deleteMany({});
  });
});
