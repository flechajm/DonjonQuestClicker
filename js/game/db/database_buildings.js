import Building from "../core/buildings/building.js";
import Benefit from "../core/buildings/benefit.js";

class DbBuildings {
    #db;

    constructor() {
        this.#db = [
            // Inn
            new Building({
                id: 1,
                icon: 'inn',
                baseCost: 20,
                unlockAchievment: 2,
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
                        coinsGainMultiplier: 1,
                        calculateAsPercent: true,
                    }),
                ],
            }),

            // Sawmill
            new Building({
                id: 3,
                icon: 'sawmill',
                baseCost: 1700,
                benefits: [
                    new Benefit({
                        coinsGain: 7,
                    }),
                ],
            }),

            // Carpentry
            new Building({
                id: 4,
                icon: 'carpentry',
                baseCost: 15000,
                benefits: [
                    new Benefit({
                        coinsGain: 40,
                    }),
                    new Benefit({
                        coinsGain: 20,
                        targetBuilding: 3,
                        calculateAsPercent: true,
                    }),
                ],
            }),

            // Tavern
            new Building({
                id: 5,
                icon: 'tavern',
                baseCost: 150000,
                benefits: [
                    new Benefit({
                        coinsGain: 220,
                    }),
                    new Benefit({
                        coinsBonusPerQuest: 10,
                    }),
                    new Benefit({
                        coinsGain: 10,
                        targetBuilding: 1,
                        calculateAsPercent: true,
                    }),
                ],
            }),

            // Scout
            new Building({
                id: 6,
                icon: 'scout',
                baseCost: 980000,
                benefits: [
                    new Benefit({
                        coinsBonusPerQuest: 300,
                    }),
                    // new Benefit({
                    //     coinsGain: 15,
                    //     targetBuilding: 5,
                    //     calculateAsPercent: true,
                    // }),
                ],
            }),

            // Shield Bearer
            new Building({
                id: 7,
                icon: 'shield_bearer',
                baseCost: 12.3e6,
                benefits: [
                    new Benefit({
                        coinsGain: 2700,
                    }),
                    new Benefit({
                        coinsBonusPerQuest: 1500,
                    }),
                    new Benefit({
                        coinsMultiplierPerQuest: 15,
                        calculateAsPercent: true,
                    }),
                    // new Benefit({
                    //     coinsGain: 20,
                    //     targetBuilding: 5,
                    //     calculateAsPercent: true,
                    // }),
                ],
            }),

            // Forge
            new Building({
                id: 8,
                icon: 'forge',
                baseCost: 2.7e8,
                benefits: [
                    // new Benefit({
                    //     coinsGain: 500,
                    //     targetBuilding: 1,
                    //     calculateAsPercent: true,
                    // }),
                    // new Benefit({
                    //     coinsBonusPerQuest: 150,
                    //     targetBuilding: 6,
                    // }),
                    new Benefit({
                        coinsGain: 150,
                        calculateAsPercent: true,
                        targetBuilding: 7,
                    }),
                    // new Benefit({
                    //     coinsBonusPerQuest: 50,
                    //     calculateAsPercent: true,
                    //     targetBuilding: 7,
                    // }),
                    // new Benefit({
                    //     coinsMultiplierPerQuest: 1,
                    //     targetBuilding: 7,
                    //     calculateAsPercent: true,
                    // }),
                ],
            }),

            // Wizard
            new Building({
                id: 9,
                icon: 'wizard',
                baseCost: 7500000,
                benefits: [
                    new Benefit({
                        coinsGain: 150,
                        calculateAsPercent: true,
                        //targetBuilding: 7,
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