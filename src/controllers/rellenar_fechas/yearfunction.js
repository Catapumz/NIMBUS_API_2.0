function ala() {
  for (i = 1; i <= 12; i++) {
    for (j = 1; j <= 28; j++) {
      const fechaa = (mes, anio) => {
        return "2023-" + mes + "-" + anio;
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

      console.log(fechaa(i1, j1));
    }
  }
}
ala();
