/**
 * Clase que representa un Beneficio para un edificio o mejora.
 */
class Benefit {
    /**
     * Crea una instancia de Benefit.
     * @param {String} description              Descripción del beneficio.
     * @param {Number} coinsGain                Ganancia de monedas por segundo.
     * @param {Number} coinsGainMultiplier      Multiplicador de ganancia de monedas por segundo.
     * @param {Number} coinsBonusPerQuest       Ganancia de monedas por quest.
     * @param {Number} coinsMultiplierPerQuest  Multiplicador de ganancia de monedas por quest.
     */
    constructor({ description, coinsGain, coinsGainMultiplier, coinsBonusPerQuest, coinsMultiplierPerQuest }) {
        /**
         * Descripción del beneficio.
         */
        this.description = description ?? null;

        /**
         * Ganancia de monedas por segundo.
         */
        this.coinsGain = coinsGain ?? null;

        /**
         * Multiplicador de ganancia de monedas por segundo.
         */
        this.coinsGainMultiplier = coinsGainMultiplier ?? null;

        /**
         * Ganancia de monedas por quest.
         */
        this.coinsBonusPerQuest = coinsBonusPerQuest ?? null;

        /**
         * Multiplicador de ganancia de monedas por quest.
         */
        this.coinsMultiplierPerQuest = coinsMultiplierPerQuest ?? null;
    }

    getValue() {
        return this.coinsGain ?? this.coinsGainMultiplier ?? this.coinsBonusPerQuest ?? this.coinsMultiplierPerQuest;
    }

    getFormattedValue(value, color) {
        let isPercent = this.coinsGainMultiplier > 0 || this.coinsMultiplierPerQuest > 0;
        return `<span style='color: var(--${color});'><b>+${value}${isPercent ? '%' : ''}</b></span>`;
    }
}

export default Benefit;