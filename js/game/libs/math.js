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


function roundNumber(number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}