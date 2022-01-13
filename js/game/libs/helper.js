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
 * Concatena cadenas con varios parámetros. El primer parámetro es una cadena de string. Los demás parámetros son variables de cualquier tipo.
 * @returns
 */
String.format = function () {
  let string = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "g");
    // La expresión "g" al final de la declaración RegExp significa que la sustitución debería ocurrir más de una vez.
    string = string.replace(reg, arguments[i + 1]);
  }

  return string;
};

/**
 * Embellece los números largos para que queden cortos y más descriptibles con su escala numérica.
 * @returns {String} Número corto con escala numérica.
 */
Number.pretty = function (number) {
  if (number == null) return;

  let prettyNumber = Math.ceil(number)?.toString();

  if (prettyNumber.length < 7) return number.commafy();

  let visualLeng = 6;
  let maxLeng = 4;
  let leng = 4;
  let sliceMin = 1;
  let sliceMax = 3;
  let unitIndex = 0;
  let units = gameManager.getUnits();

  for (var g = 0; g < prettyNumber.length; g++) {
    if (prettyNumber.length <= visualLeng) {
      if (leng < maxLeng) {
        leng = maxLeng;
      }

      if (prettyNumber.length === leng) {
        if (sliceMin > 2) {
          prettyNumber = String(number.toString().slice(0, sliceMin)).commafy() + units[unitIndex];
          break;
        } else {
          prettyNumber =
            number.toString().slice(0, sliceMin) + "." + number.toString().slice(sliceMin, sliceMax) + units[unitIndex];
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
