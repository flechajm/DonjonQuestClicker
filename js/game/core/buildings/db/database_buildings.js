import Building from "../building.js";
import Benefit from "../benefit.js";

class DbBuildings {
    #db;

    constructor() {
        this.#db = [
            // Inn
            new Building({
                id: 1,
                icon: 'inn',
                baseCost: 20,
                benefits: [
                    new Benefit({
                        coinsGain: 0.5
                    }),
                ],
            }),

            // Farm
            new Building({
                id: 2,
                icon: 'farm',
                baseCost: 100,
                benefits: [
                    new Benefit({
                        coinsGainMultiplier: 0.05
                    }),
                ],
            }),

            // Sawmill
            new Building({
                id: 3,
                icon: 'sawmill',
                baseCost: 100,
                benefits: [
                    new Benefit({
                        coinsGain: 2,
                    }),
                ],
            }),

            // Carpentry
            new Building({
                id: 4,
                icon: 'carpentry',
                baseCost: 1500,
                benefits: [
                    new Benefit({
                        coinsGain: 5,
                    }),
                    new Benefit({
                        coinsGain: 50,
                        targetBuilding: 3,
                    }),
                ],
            }),

            // Tavern
            new Building({
                id: 5,
                icon: 'tavern',
                baseCost: 15000,
                benefits: [
                    new Benefit({
                        coinsGain: 5,
                    }),
                ],
            }),

            // Minas Oscuras
            new Building({
                id: 6,
                baseCost: 15000,
                isDungeon: true,
                benefits: [
                    new Benefit({
                        coinsGain: 10,
                    }),
                    new Benefit({
                        coinsMultiplierPerQuest: 0.05,
                    }),
                ],
            }),
        ];
    }

    getDB() {
        return this.#db;
    }
}


export default DbBuildings;