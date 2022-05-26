/**
 * Clase que representa un edificio.
 */
class Building {
    /**
     * Crea la instancia de Building.
     * @param {Number}  id                  Id del edificio.
     * @param {String}  name                Nombre del edificio.
     * @param {String}  description         Descripción del edificio.
     * @param {String}  icon                Nombre del archivo del ícono.
     * @param {String}  level               Nivel del edificio.
     * @param {Number}  baseCost            Costo base del edificio. Es el costo incial.
     * @param {Number}  cost                Costo actual del edificio. Es el costo que crece exponencialmente.
     * @param {Benefit} benefits            Beneficios del edificio.
     * @param {Boolean} isDungeon           Indica si es un Dungeon o no.
     * @param {Number}  unlockAchievment    Indica si desbloquea un logro. Representa el Id del logro.
     * @param {String}  quote               Cita.
     */
    constructor({ id, name, description, icon, level, baseCost, cost, benefits, isDungeon = false, unlockAchievment, quote }) {
        /**
         * Id del edificio.
         */
        this.id = id;

        /**
         * Nombre del edificio.
         */
        this.name = name;

        /**
         * Descripción del edificio.
         */
        this.description = description;

        /**
         * Nombre del archivo del ícono.
         */
        this.icon = icon;

        /**
         * Nivel del edificio.
         */
        this.level = level ?? 1;

        /**
         * Costo base del edificio. Es el costo incial.
         */
        this.baseCost = baseCost;

        /**
         * Costo actual del edificio. Es el costo que crece exponencialmente.
         */
        this.cost = cost ?? baseCost;

        /**
         * Beneficios del edificio.
         */
        this.benefits = benefits;

        /**
         * Indica si es un Dungeon o no.
         */
        this.isDungeon = isDungeon;

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

export default Building;