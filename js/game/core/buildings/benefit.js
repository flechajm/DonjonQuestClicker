/**
 * Clase que representa un Beneficio para un edificio o mejora.
 */
class Benefit {
    /**
     * Crea una instancia de Benefit.
     * @param {String} description              Descripción del beneficio.
     * @param {Number} population               Población generada.
     * @param {Number} coinsGain                Ganancia de monedas por segundo.
     * @param {Number} coinsGainMultiplier      Multiplicador de ganancia de monedas por segundo.
     * @param {Number} coinsBonusPerQuest       Ganancia de monedas por quest.
     * @param {Number} coinsMultiplierPerQuest  Multiplicador de ganancia de monedas por quest.
     */
    constructor({ description, population, coinsGain, coinsGainMultiplier, coinsBonusPerQuest, coinsMultiplierPerQuest }) {
        /**
         * Descripción del beneficio.
         */
        this.description = description;

        /**
         * Población generada.
         */
        this.population = population ?? 0;

        /**
         * Ganancia de monedas por segundo.
         */
        this.coinsGain = coinsGain ?? 0;

        /**
         * Multiplicador de ganancia de monedas por segundo.
         */
        this.coinsGainMultiplier = coinsGainMultiplier ?? 0;

        /**
         * Ganancia de monedas por quest.
         */
        this.coinsBonusPerQuest = coinsBonusPerQuest ?? 0;

        /**
         * Multiplicador de ganancia de monedas por quest.
         */
        this.coinsMultiplierPerQuest = coinsMultiplierPerQuest ?? 0;
    }
}

export default Benefit;