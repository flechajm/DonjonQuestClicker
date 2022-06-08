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
    constructor({
        description,
        coinsGain,
        coinsGainMultiplier,
        coinsBonusPerQuest,
        coinsMultiplierPerQuest,
        targetBuilding,
        calculateAsPercent,
    }) {
        /**
         * Descripción del beneficio.
         */
        this.description = description ?? null;

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

        /**
         * Especifica si el beneficio aplica a otro edificio.
         */
        this.targetBuilding = targetBuilding ?? null;


        /**
         * Indica si los beneficios otorgados deben calcularse como un porcentaje, sino, sólo se suman.
         */
        this.calculateAsPercent = calculateAsPercent ?? false;

        this.aditional = '';
    }

    /**
     * Obtiene el valor del beneficio.
     * @returns {Number} Valor del beneficio.
     */
    getValue() {
        if (this.coinsGain > 0) return this.coinsGain;
        if (this.coinsGainMultiplier > 0) return this.coinsGainMultiplier;
        if (this.coinsBonusPerQuest > 0) return this.coinsBonusPerQuest;
        if (this.coinsMultiplierPerQuest > 0) return this.coinsMultiplierPerQuest;
    }

    /**
     * Formatea con estilo la descripción del valor del beneficio.
     * @param {Number} value Valor del beneficio.
     * @param {String} color Color para formatear.
     * @returns 
     */
    getFormattedValue(value, color) {
        return `<span style='color: var(--${color});'><b>+${value}${this.calculateAsPercent ? '%' : ''}</b></span>`;
    }

    getFullDescription(buildingQuantity, numberUnits) {
        let value = this.getFormattedValue(Number.pretty(this.getValue(), numberUnits), 'benefit');
        let totalValue = this.getFormattedValue(Number.pretty(roundNumber(this.getValue() * buildingQuantity), numberUnits), "available");
        let finalDescription = String(this.description).replace('{g}', value).replace('{t}', totalValue);

        return finalDescription;
    }
}

export default Benefit;