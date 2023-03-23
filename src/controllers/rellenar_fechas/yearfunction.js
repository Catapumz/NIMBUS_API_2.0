const array = [];
function ala(hastaqui) {
  x = 0;
  for (i = 1; i <= 12; i++) {
    if (x == hastaqui) {
      break;
    }
    for (j = 1; j <= 28; j++) {
      if (x == hastaqui) {
        break;
      }
      const fechaa = (mes, anio) => {
        return "2022-" + mes + "-" + anio;
      };

      if (i < 10) {
        i1 = "0" + i;
      } else {
        i1 = i;
      }

      if (j < 10) {
        j1 = "0" + j;
      } else {
        j1 = j;
      }

      array[x] = fechaa(i1, j1);
      x++;
    }
  }
  return array;
}

module.exports = { ala };
