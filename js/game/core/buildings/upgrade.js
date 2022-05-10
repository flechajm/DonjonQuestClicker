/**
 * Clase que representa una mejora.
 */
class Upgrade {
    /**
     * Crea la instancia de Upgrade.
     * @param {Number}          id          Id de la mejora.
     * @param {String}          name        Nombre de la mejora.
     * @param {String}          description Descripción de la mejora.
     * @param {Number}          cost        Costo de la mejora.
     * @param {Array<Tiers>}    tiers       Lista de tiers de la mejora.
     * @param {String}          quote       Cita.
     */
    constructor({ id, name, description, cost, tiers, quote }) {
        /**
         * Id de la mejora.
         */
        this.id = id;

        /**
         * Nombre de la mejora.
         */
        this.name = name;

        /**
         * Descripción de la mejora.
         */
        this.description = description;

        /**
         * Costo de la mejora.
         */
        this.cost = cost;

        /**
         * Lista de tiers de la mejora.
         */
        this.tiers = tiers;

        /**
         * Cita.
         */
        this.quote = quote;
    }
}

export default Upgrade;