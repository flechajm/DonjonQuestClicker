/**
 * Clase que representa la Tier de un Upgrade.
 */
class Tier {

    /**
     * Crea la instancia de una Tier.
     * @param {Number}  number              Nivel de la tier. 
     * @param {Number}  cost                Costo de la tier.
     * @param {Benefit} benefits            Beneficios de la tier.
     * @param {Boolean} levelUp             Indica a qué level sube edificio propio de la mejora.
     * @param {Number}  unlockAchievment    Indica si desbloquea un logro. Representa el Id del logro.
     * @param {String}  quote               Cita.
     */
    constructor({ number, cost, benefits, levelUp, unlockAchievment, quote }) {
        /**
         * Nivel de la tier. 
         */
        this.number = number;

        /**
         * Costo de la tier.
         */
        this.cost = cost;

        /**
         * Beneficios de la tier.
         */
        this.benefits = benefits;

        /**
         * Indica a qué level sube edificio propio de la mejora.
         */
        this.levelUp = levelUp ?? 1;

        /**
         * Indica si desbloquea un logro. Representa el Id del logro.
         */
        this.unlockAchievment = unlockAchievment ?? -1;

        /**
         * Cita.
         */
        this.quote = quote;
    }
}

export default Tier;