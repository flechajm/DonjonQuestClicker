/**
 * Clase que representa un edificio o mejora.
 */
class Building {
    /**
     * Crea la instancia de Building.
     * @param {Number}  id          Id del edificio o mejora.
     * @param {String}  name        Nombre del edificio o mejora.
     * @param {String}  description Descripción del edificio o mejora.
     * @param {Number}  baseCost    Costo base del edificio o mejora. Es el costo incial.
     * @param {Number}  cost        Costo actual del edificio o mejora. Es el costo que crece exponencialmente.
     * @param {Benefit} benefits    Beneficios del edificio o mejora.
     * @param {Boolean} isDungeon   Indica si es un Dungeon o no.
     * @param {String}  quote       Cita.
     */
    constructor({ id, name, description, baseCost, cost, benefits, isDungeon = false, quote }) {
        /**
         * Id del edificio o mejora.
         */
        this.id = id;

        /**
         * Nombre del edificio o mejora.
         */
        this.name = name;

        /**
         * Descripción del edificio o mejora.
         */
        this.description = description;

        /**
         * Costo base del edificio o mejora. Es el costo incial.
         */
        this.baseCost = baseCost;

        /**
         * Costo actual del edificio o mejora. Es el costo que crece exponencialmente.
         */
        this.cost = cost ?? baseCost;

        /**
         * Beneficios del edificio o mejora.
         */
        this.benefits = benefits;

        /**
         * Indica si es un Dungeon o no.
         */
        this.isDungeon = isDungeon;

        /**
         * Cita.
         */
        this.quote = quote;
    }
}

export default Building;