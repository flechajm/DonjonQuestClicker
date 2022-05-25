/**
 * Clase que representa la Tier de un Upgrade.
 */
class Tier {

    /**
     * Crea la instancia de una Tier.
     * @param {Number}  number      Nivel de la tier. 
     * @param {Number}  cost        Costo de la tier.
     * @param {Benefit} benefits    Beneficios de la tier.
     * @param {String}  quote       Cita.
     */
    constructor({ number, cost, benefits, quote }) {
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
         * Cita.
         */
        this.quote = quote;
    }
}

export default Tier;