/**
 * Añade comas (puntos) a los números.
 * @returns {String} Número en formato de cadena de texto.
 */
String.prototype.commafy = function () {
  return this.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Añade comas (puntos) a los números.
 * @returns {String} Número en formato de cadena de texto.
 */
Number.prototype.commafy = function () {
  return String(this).commafy();
};

/**
 * Encripta una cadena de texto.
 * @returns {String} Cadena de texto encriptada.
 */
String.prototype.encrypt = function () {
  return window.btoa(this);
};

/**
 * Desencripta una cadena de texto encriptada.
 * @returns {String} Cadena de texto desencriptada.
 */
String.prototype.decrypt = function () {
  return window.atob(this);
};

/**
 * Embellece los números largos para que queden cortos y más descriptibles con su escala numérica.
 * @returns {String} Número corto con escala numérica.
 */
Number.prototype.prettyNumber = function () {
  let prettyNumber = this.toString();

  if (prettyNumber.length < 7) return this.commafy();

  let visualLeng = 6;
  let maxLeng = 4;
  let leng = 4;
  let sliceMin = 1;
  let sliceMax = 3;
  let unitIndex = 0;
  let units = gameManager.getUnits();

  // let units2 = [
  //   " Thousand",
  //   " Million",
  //   " Billion",
  //   " Trillion",
  //   " Quadrillion",
  //   " Quintillion",
  //   " Sextillion",
  //   " Septillion",
  //   " Octillion",
  //   " Nonillion",
  //   " Decillion",
  //   " Undecillion",
  //   " Duodecillion",
  //   " Tredecillion",
  //   " Quatuordecillion",
  //   " Quindecillion",
  //   " Sexdecillion",
  //   " Septendecillion",
  //   " Octodecillion",
  //   " Novemdecillion",
  //   " Vigintillion",
  //   " Unvigintillion",
  //   " Duovigintillion",
  //   " Tresvigintillion",
  //   " Quatuorvigintillion",
  //   " Quinquavigintillion",
  //   " Sesvigintillion",
  //   " Septemvigintillion",
  //   " Octovigintillion",
  //   " Novemvigintillion",
  //   " Trigintillion",
  //   " Untrigintillion",
  //   " Duotrigintillion",
  //   " Trestrigintillion",
  //   " Quatuortrigintillion",
  //   " Quinquatrigintillion",
  //   " Sestrigintillion",
  //   " Septentrigintillion",
  //   " Octotrigintillion",
  //   " Novemtrigintillion",
  //   " Quadragintillion",
  //   " Unquadragintillion",
  //   " Duoquadragintillion",
  //   " Tresquadragintillion",
  //   " Quatuorquadragintillion",
  //   " Quinquaquadragintillion",
  //   " Sesquadragintillion",
  //   " Septemquadragintillion",
  //   " Octoquadragintillion",
  //   " Novemquadragintillion",
  //   " Quinquagintillion",
  //   " Unquinquagintillion",
  //   " Duoquinquagintillion",
  //   " Tresquinquagintillion",
  //   " Quatuorquinquagintillion",
  //   " Quinquaquinquagintillion",
  //   " Sesquinquagintillion",
  //   " Septenquinquagintillion",
  //   " Octoquinquagintillion",
  //   " Novemquinquagintillion",
  //   " Sexagintillion",
  //   " Unsexagintillion",
  //   " Duosexagintillion",
  //   " Tressexagintillion",
  //   " Quatuorsexagintillion",
  //   " Quinquasexagintillion",
  //   " Sexasexagintillion",
  //   " Septemsexagintillion",
  //   " Octosexagintillion",
  //   " Novemsexagintillion",
  //   " Septuagintillion",
  //   " Unseptuagintillion",
  //   " Duoseptuagintillion",
  //   " Tresseptuagintillion",
  //   " Quatuorseptuagintillion",
  //   " Quinquaseptuagintillion",
  //   " Sexaseptuagintillion",
  //   " Septenseptuagintillion",
  //   " Octoseptuagintillion",
  //   " Novemseptuagintillion",
  //   " Octogintillion",
  //   " Unoctogintillion",
  //   " Duooctogintillion",
  //   " Tresoctogintillion",
  //   " Quatuoroctogintillion",
  //   " Quinquaoctogintillion",
  //   " Sesoctogintillion",
  //   " Septemoctogintillion",
  //   " Octooctogintillion",
  //   " Novemoctogintillion",
  //   " Nonagintillion",
  //   " Unnonagintillion",
  //   " Duononagintillion",
  //   " Tresnonagintillion",
  //   " Quatuornonagintillion",
  //   " Quinquanonagintillion",
  //   " Sesnonagintillion",
  //   " Septemnonagintillion",
  //   " Octononagintillion",
  //   " Novemnonagintillion",
  //   " Centillion",
  //   " Uncentillion",
  // ];

  for (var g = 0; g < prettyNumber.length; g++) {
    if (prettyNumber.length <= visualLeng) {
      if (leng < maxLeng) {
        leng = maxLeng;
      }

      if (prettyNumber.length === leng) {
        if (sliceMin > 2) {
          prettyNumber = String(this.toString().slice(0, sliceMin)).commafy() + units[unitIndex];
          break;
        } else {
          prettyNumber =
            this.toString().slice(0, sliceMin) + "." + this.toString().slice(sliceMin, sliceMax) + units[unitIndex];
          break;
        }
      } else {
        leng++;
        sliceMin++;
      }
    } else {
      maxLeng += 3;
      visualLeng += 3;
      unitIndex++;
    }
  }

  return prettyNumber;
};
