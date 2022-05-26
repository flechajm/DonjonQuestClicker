import Upgrade from "../core/buildings/upgrade.js";
import Tier from "../core/buildings/tier.js";
import Benefit from "../core/buildings/benefit.js";

class DbUpgrades {
    #db = [];

    constructor() {
        this.#db = [
            new Upgrade({
                id: 1,
                icon: 'inn',
                baseCost: 100,
                tiers: [
                    new Tier({
                        number: 1,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 2,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 1, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 3,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 2, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 4,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 5,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 15, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 6,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 30, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 7,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 50, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 8,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 100, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 9,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 150, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 10,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 250, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 11,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 500, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 12,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 1000, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 13,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 3000, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 14,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 5000, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 15,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 10000, targetBuilding: 1 }),
                        ]
                    }),
                ]
            }),
            new Upgrade({
                id: 2,
                icon: 'farm',
                baseCost: 100,
                tiers: [
                    new Tier({
                        number: 1,
                        benefits: [
                            new Benefit({ coinsGain: 0.5 }),
                        ]
                    }),
                ]
            }),
        ];
    }

    getDB() {
        return this.#db;
    }
}

export default DbUpgrades;