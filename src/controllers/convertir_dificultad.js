/*function ndificultad(dificultad) {
  if (dificultad == "negro") {
    return 4278190080;
  } else if (dificultad == "morado") {
    return 4288423856;
  } else if (dificultad == "naranja") {
    return 4294940672;
  } else if (dificultad == "amarillo") {
    return 4294961979;
  } else if (dificultad == "verde") {
    return 4283215696;
  }
}*/

const ndificultad = {
  negro: 4278190080,
  morado: [4293467747, 4294918273],
  naranja: [4294940672, 4294945600],
  amarillo: 4294961979,
  verde: 4283215696,
};

module.exports = ndificultad;
