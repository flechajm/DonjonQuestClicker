/**
 * Obtiene un número aleatorio entre dos.
 * @param {Number} num1 Número mínimo.
 * @param {Number} num2 Número máximo.
 * @returns {Number} Número aleatorio entre el mínimo y el máximo.
 */
function randomBetween(num1, num2) {
  let result = num2 - num1 + 1;
  return Math.floor(Math.random() * result + num1);
}

/**
 * Redondea un número.
 * @param {Number} number Número a redondear.
 * @returns {Number} Número redondeado.
 */
function roundNumber(number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

/**
 * Calcula el porcentaje de un número y lo suma como resultado.
 * @param {Number}  value   Valor a calcular el porcentaje.
 * @param {Number}  percent Porcentaje a calcular.
 * @returns {Number} Suma de su porcentaje.
 */
function sumPercent(value, percent) {
  if (percent == 0) return 0;
  return value + ((percent / 100) * value);
}