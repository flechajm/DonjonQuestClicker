import Achievment from "../core/achievments/achievment.js";

class DbAchievments {
    #db;

    constructor() {
        this.#db = [
            new Achievment({
                id: 1,
                title: 'Bienvenido',
                description: '¡Abre tu primer cofre!',
                icon: 'treasure_chest',
                reachValue: 1,
                reachType: 'coin',
            }),
            new Achievment({
                id: 2,
                title: 'Hogar, dulce hogar',
                description: 'El comienzo de una aventura.',
                icon: 'buildings/inn',
                reachValue: 1,
                reachType: 'coin',
            }),
        ];
    }

    getDB() {
        return this.#db;
    }
}


export default DbAchievments;