/**
 * Clase que representa un Beneficio para un edificio o mejora.
 */
class Benefit {
    /**
     * Crea una instancia de Benefit.
     * @param {String} description              Descripción del beneficio.
     * @param {Number} coinsGain                Ganancia de monedas por segundo. Si afecta a otro edificio se considera un porcentaje.
     * @param {Number} coinsGainMultiplier      Multiplicador de ganancia de monedas por segundo. Si afecta a otro edificio se considera un porcentaje.
     * @param {Number} coinsBonusPerQuest       Ganancia de monedas por quest. Si afecta a otro edificio se considera un porcentaje.
     * @param {Number} coinsMultiplierPerQuest  Multiplicador de ganancia de monedas por quest. Si afecta a otro edificio se considera un porcentaje.
     * @param {Number} targetBuilding           Especifica si el beneficio aplica a otro edificio.
     */
    constructor({ description, coinsGain, coinsGainMultiplier, coinsBonusPerQuest, coinsMultiplierPerQuest, targetBuilding }) {
        /**
         * Descripción del beneficio.
         */
        this.description = description ?? null;

        /**
         * Ganancia de monedas por segundo. Si afecta a otro edificio se considera un porcentaje.
         */
        this.coinsGain = coinsGain ?? null;

        /**
         * Multiplicador de ganancia de monedas por segundo. Si afecta a otro edificio se considera un porcentaje.
         */
        this.coinsGainMultiplier = coinsGainMultiplier ?? null;

        /**
         * Ganancia de monedas por quest. Si afecta a otro edificio se considera un porcentaje.
         */
        this.coinsBonusPerQuest = coinsBonusPerQuest ?? null;

        /**
         * Multiplicador de ganancia de monedas por quest. Si afecta a otro edificio se considera un porcentaje.
         */
        this.coinsMultiplierPerQuest = coinsMultiplierPerQuest ?? null;

        /**
         * Especifica si el beneficio aplica a otro edificio.
         */
        this.targetBuilding = targetBuilding ?? null;
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