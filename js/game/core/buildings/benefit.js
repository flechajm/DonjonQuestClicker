import GameBuildings from "../game_buildings.js";
import LanguageManager from "../../libs/language_manager.js";

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
    static getFormattedValue(value, isPercent, color) {
        return `<span style='color: var(--${color});'><b>+${value}${isPercent ? '%' : ''}</b></span>`;
    }

    setBaseDescription(targetBuilding) {
        const langData = LanguageManager.getData();
        if (this.coinsGain > 0) {
            if (this.targetBuilding == null || this.targetBuilding == targetBuilding) {
                this.description = langData.benefits.coinsGain.self;
            } else if (this.targetBuilding != targetBuilding) {
                this.description = langData.benefits.coinsGain.toBuilding;
            }
        }

        if (this.coinsGainMultiplier > 0) {
            if (this.targetBuilding == null || this.targetBuilding == targetBuilding) {
                this.description = langData.benefits.coinsGainMultiplier.self;
            } else if (this.targetBuilding != targetBuilding) {
                this.description = langData.benefits.coinsGainMultiplier.toBuilding;
            }
        }

        if (this.coinsBonusPerQuest > 0) {
            if (this.targetBuilding == null || this.targetBuilding == targetBuilding) {
                this.description = langData.benefits.coinsBonusPerQuest.self;
            } else if (this.targetBuilding != targetBuilding) {
                this.description = langData.benefits.coinsBonusPerQuest.toBuilding;
            }
        }

        if (this.coinsMultiplierPerQuest > 0) {
            if (this.targetBuilding == null || this.targetBuilding == targetBuilding) {
                this.description = langData.benefits.coinsMultiplierPerQuest.self;
            } else if (this.targetBuilding != targetBuilding) {
                this.description = langData.benefits.coinsMultiplierPerQuest.toBuilding;
            }
        }
    }

    getFullDescription(buildingQuantity, buildingId, numberUnits) {
        this.setBaseDescription(buildingId);
        let value = Benefit.getFormattedValue(Number.pretty(this.getValue(), numberUnits), this.calculateAsPercent, 'benefit');
        let totalValue = Benefit.getFormattedValue(Number.pretty(roundNumber(this.getValue() * buildingQuantity), numberUnits), this.calculateAsPercent, "available");
        let finalDescription = String(this.description).replace('{g}', value).replace('{t}', totalValue);

        if (this.targetBuilding) {
            const targetBuilding = GameBuildings.getBuildingById(this.targetBuilding);
            finalDescription = finalDescription.replace("{b}", GameBuildings.getFormattedName(targetBuilding.name, 'gold', targetBuilding.getIcon()));
        }

        return finalDescription;
    }
}

export default Benefit;