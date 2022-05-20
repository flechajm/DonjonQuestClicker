import Upgrade from "../upgrade.js";
import Tier from "../tier.js";
import Benefit from "../benefit.js";

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
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 2,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 3,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 4,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 5,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 6,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 7,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 8,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 9,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 10,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 11,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 12,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 13,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 14,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 15,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 1 }),
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