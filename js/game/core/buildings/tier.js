/**
 * Clase que representa la Tier de un Upgrade.
 */
class Tier {

    /**
     * Crea la instancia de una Tier.
     * @param {Number} number       Nivel de la tier. 
     * @param {Number} cost         Costo de la tier.
     * @param {Benefit} benefits    Beneficios de la tier.
     */
    constructor({ number, cost, benefits }) {
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
    }
}

export default Tier;