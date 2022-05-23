import Achievment from "../core/achievments/achievment.js";

class DbAchievments {
    #db;

    constructor() {
        this.#db = [
            // Welcome
            new Achievment({
                id: 1,
                icon: 'treasure_chest',
                reachValue: 1,
                reachType: 'treasure',
            }),

            // Inn
            new Achievment({
                id: 2,
                icon: 'buildings/inn',
                reachValue: 1,
                reachType: 'building',
            }),

            // Coins
            new Achievment({
                id: 3,
                icon: 'coins',
                reachValue: 10,
                reachType: 'coin',
            }),


            // Coins
            new Achievment({
                id: 4,
                icon: 'coins',
                reachValue: 100,
                reachType: 'idle',
            }),

            // Coins
            new Achievment({
                id: 5,
                icon: 'coins',
                reachValue: 200,
                reachType: 'idle',
            }),

            new Achievment({
                id: 6,
                icon: 'coins',
                reachValue: 300,
                reachType: 'idle',
            }),
        ];
    }

    getDB() {
        return this.#db;
    }
}


export default DbAchievments;