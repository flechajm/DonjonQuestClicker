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
                baseCost: 1e2,
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
                            new Benefit({ coinsGain: 5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 4,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 15, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 5,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 30, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 6,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 5e3, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 7,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 1e4, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 8,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 5e4, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 9,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 2e5, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 10,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 1e6, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 11,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 1e7, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 12,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 1e8, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 13,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 1e9, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 14,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 1e10, targetBuilding: 1 }),
                        ]
                    }),
                    new Tier({
                        number: 15,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 5e11, targetBuilding: 1 }),
                        ]
                    }),
                ]
            }),
            new Upgrade({
                id: 2,
                icon: 'farm',
                baseCost: 1e3,
                tiers: [
                    new Tier({
                        number: 1,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 0.5, calculateAsPercent: true, targetBuilding: 2 }),
                        ]
                    }),
                    new Tier({
                        number: 2,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 1, calculateAsPercent: true, targetBuilding: 2 }),
                        ]
                    }),
                    new Tier({
                        number: 3,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 2, calculateAsPercent: true, targetBuilding: 2 }),
                        ]
                    }),
                    new Tier({
                        number: 4,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 3, calculateAsPercent: true, targetBuilding: 2 }),
                        ]
                    }),
                    new Tier({
                        number: 5,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 4, calculateAsPercent: true, targetBuilding: 2 }),
                        ]
                    }),
                    new Tier({
                        number: 6,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 10, calculateAsPercent: true, targetBuilding: 2 }),
                            new Benefit({ coinsGain: 100000, targetBuilding: 2 }),
                        ]
                    }),
                    new Tier({
                        number: 7,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 12, calculateAsPercent: true, targetBuilding: 2 }),
                            new Benefit({ coinsGain: 200000, targetBuilding: 2 }),
                        ]
                    }),
                    new Tier({
                        number: 8,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 16, calculateAsPercent: true, targetBuilding: 2 }),
                            new Benefit({ coinsGain: 300000, targetBuilding: 2 }),
                        ]
                    }),
                    new Tier({
                        number: 9,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 18, calculateAsPercent: true, targetBuilding: 2 }),
                            new Benefit({ coinsGain: 400000, targetBuilding: 2 }),
                        ]
                    }),
                    new Tier({
                        number: 10,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 20, calculateAsPercent: true, targetBuilding: 2 }),
                            new Benefit({ coinsGain: 500000, targetBuilding: 2 }),
                        ]
                    }),
                    new Tier({
                        number: 11,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 100, calculateAsPercent: true, targetBuilding: 2 }),
                            new Benefit({ coinsGain: 3e6, targetBuilding: 2 }),
                        ]
                    }),
                    new Tier({
                        number: 12,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 300, calculateAsPercent: true, targetBuilding: 2 }),
                            new Benefit({ coinsGain: 5e6, targetBuilding: 2 }),
                        ]
                    }),
                    new Tier({
                        number: 13,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 600, calculateAsPercent: true, targetBuilding: 2 }),
                            new Benefit({ coinsGain: 10e6, targetBuilding: 2 }),
                        ]
                    }),
                    new Tier({
                        number: 14,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 900, calculateAsPercent: true, targetBuilding: 2 }),
                            new Benefit({ coinsGain: 20e6, targetBuilding: 2 }),
                        ]
                    }),
                    new Tier({
                        number: 15,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGainMultiplier: 1500, calculateAsPercent: true, targetBuilding: 2 }),
                            new Benefit({ coinsGain: 50e6, targetBuilding: 2 }),
                        ]
                    }),
                ]
            }),
            new Upgrade({
                id: 3,
                icon: 'sawmill',
                baseCost: 1e4,
                tiers: [
                    new Tier({
                        number: 1,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 1e2, targetBuilding: 3 }),
                        ]
                    }),
                    new Tier({
                        number: 2,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 5e2, targetBuilding: 3 }),
                        ]
                    }),
                    new Tier({
                        number: 3,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 1e3, targetBuilding: 3 }),
                        ]
                    }),
                    new Tier({
                        number: 4,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 2.5e3, targetBuilding: 3 }),
                        ]
                    }),
                    new Tier({
                        number: 5,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 5e3, targetBuilding: 3 }),
                        ]
                    }),
                    new Tier({
                        number: 6,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 3e4, targetBuilding: 3 }),
                        ]
                    }),
                    new Tier({
                        number: 7,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 3e5, targetBuilding: 3 }),
                        ]
                    }),
                    new Tier({
                        number: 8,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 3e6, targetBuilding: 3 }),
                        ]
                    }),
                    new Tier({
                        number: 9,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 3e7, targetBuilding: 3 }),
                        ]
                    }),
                    new Tier({
                        number: 10,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 3e8, targetBuilding: 3 }),
                        ]
                    }),
                    new Tier({
                        number: 11,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 5e10, targetBuilding: 3 }),
                        ]
                    }),
                    new Tier({
                        number: 12,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 5e11, targetBuilding: 3 }),
                        ]
                    }),
                    new Tier({
                        number: 13,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 5e12, targetBuilding: 3 }),
                        ]
                    }),
                    new Tier({
                        number: 14,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 5e13, targetBuilding: 3 }),
                        ]
                    }),
                    new Tier({
                        number: 15,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 10e13, targetBuilding: 3 }),
                        ]
                    }),
                ]
            }),
            new Upgrade({
                id: 4,
                icon: 'carpentry',
                baseCost: 1e5,
                tiers: [
                    new Tier({
                        number: 1,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 1e3, targetBuilding: 4 }),
                        ]
                    }),
                    new Tier({
                        number: 2,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 3e3, targetBuilding: 4 }),
                        ]
                    }),
                    new Tier({
                        number: 3,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 5e3, targetBuilding: 4 }),
                        ]
                    }),
                    new Tier({
                        number: 4,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 10e3, targetBuilding: 4 }),
                        ]
                    }),
                    new Tier({
                        number: 5,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 15e3, targetBuilding: 4 }),
                        ]
                    }),
                    new Tier({
                        number: 6,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 1e5, targetBuilding: 4 }),
                        ]
                    }),
                    new Tier({
                        number: 7,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 5e6, targetBuilding: 4 }),
                        ]
                    }),
                    new Tier({
                        number: 8,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 5e7, targetBuilding: 4 }),
                        ]
                    }),
                    new Tier({
                        number: 9,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 5e8, targetBuilding: 4 }),
                        ]
                    }),
                    new Tier({
                        number: 10,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 5e9, targetBuilding: 4 }),
                        ]
                    }),
                    new Tier({
                        number: 11,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 7e11, targetBuilding: 4 }),
                        ]
                    }),
                    new Tier({
                        number: 12,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 7e12, targetBuilding: 4 }),
                        ]
                    }),
                    new Tier({
                        number: 13,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 7e13, targetBuilding: 4 }),
                        ]
                    }),
                    new Tier({
                        number: 14,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 7e14, targetBuilding: 4 }),
                        ]
                    }),
                    new Tier({
                        number: 15,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 10e15, targetBuilding: 4 }),
                        ]
                    }),
                ]
            }),
            new Upgrade({
                id: 5,
                icon: 'tavern',
                baseCost: 1e6,
                tiers: [
                    new Tier({
                        number: 1,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 5e3, targetBuilding: 5 }),
                            new Benefit({ coinsBonusPerQuest: 90, targetBuilding: 5 }),
                        ]
                    }),
                    new Tier({
                        number: 2,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 1e4, targetBuilding: 5 }),
                            new Benefit({ coinsBonusPerQuest: 300, targetBuilding: 5 }),
                        ]
                    }),
                    new Tier({
                        number: 3,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 1e5, targetBuilding: 5 }),
                            new Benefit({ coinsBonusPerQuest: 1e3, targetBuilding: 5 }),
                        ]
                    }),
                    new Tier({
                        number: 4,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 1e6, targetBuilding: 5 }),
                            new Benefit({ coinsBonusPerQuest: 1e4, targetBuilding: 5 }),
                        ]
                    }),
                    new Tier({
                        number: 5,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 1e7, targetBuilding: 5 }),
                            new Benefit({ coinsBonusPerQuest: 1e5, targetBuilding: 5 }),
                        ]
                    }),
                    new Tier({
                        number: 6,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 5e8, targetBuilding: 5 }),
                            new Benefit({ coinsBonusPerQuest: 5e6, targetBuilding: 5 }),
                        ]
                    }),
                    new Tier({
                        number: 7,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 5e9, targetBuilding: 5 }),
                            new Benefit({ coinsBonusPerQuest: 5e7, targetBuilding: 5 }),
                        ]
                    }),
                    new Tier({
                        number: 8,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 100, targetBuilding: 5 }),
                        ]
                    }),
                    new Tier({
                        number: 9,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 150, targetBuilding: 5 }),
                        ]
                    }),
                    new Tier({
                        number: 10,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 250, targetBuilding: 5 }),
                        ]
                    }),
                    new Tier({
                        number: 11,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 500, targetBuilding: 5 }),
                        ]
                    }),
                    new Tier({
                        number: 12,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 1000, targetBuilding: 5 }),
                        ]
                    }),
                    new Tier({
                        number: 13,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 3000, targetBuilding: 5 }),
                        ]
                    }),
                    new Tier({
                        number: 14,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 5000, targetBuilding: 5 }),
                        ]
                    }),
                    new Tier({
                        number: 15,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 10000, targetBuilding: 5 }),
                        ]
                    }),
                ]
            }),
            new Upgrade({
                id: 6,
                icon: 'scout',
                baseCost: 1e7,
                tiers: [
                    new Tier({
                        number: 1,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsBonusPerQuest: 100, targetBuilding: 6 }),
                            new Benefit({ coinsGain: 0.5, targetBuilding: 6 }),
                        ]
                    }),
                    new Tier({
                        number: 2,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 1, targetBuilding: 6 }),
                        ]
                    }),
                    new Tier({
                        number: 3,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 2, targetBuilding: 6 }),
                        ]
                    }),
                    new Tier({
                        number: 4,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 5, targetBuilding: 6 }),
                        ]
                    }),
                    new Tier({
                        number: 5,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 15, targetBuilding: 6 }),
                        ]
                    }),
                    new Tier({
                        number: 6,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 30, targetBuilding: 6 }),
                        ]
                    }),
                    new Tier({
                        number: 7,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 50, targetBuilding: 6 }),
                        ]
                    }),
                    new Tier({
                        number: 8,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 100, targetBuilding: 6 }),
                        ]
                    }),
                    new Tier({
                        number: 9,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 150, targetBuilding: 6 }),
                        ]
                    }),
                    new Tier({
                        number: 10,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 250, targetBuilding: 6 }),
                        ]
                    }),
                    new Tier({
                        number: 11,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 500, targetBuilding: 6 }),
                        ]
                    }),
                    new Tier({
                        number: 12,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 1000, targetBuilding: 6 }),
                        ]
                    }),
                    new Tier({
                        number: 13,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 3000, targetBuilding: 6 }),
                        ]
                    }),
                    new Tier({
                        number: 14,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 5000, targetBuilding: 6 }),
                        ]
                    }),
                    new Tier({
                        number: 15,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 10000, targetBuilding: 6 }),
                        ]
                    }),
                ]
            }),
            new Upgrade({
                id: 7,
                icon: 'shield_bearer',
                baseCost: 1e8,
                tiers: [
                    new Tier({
                        number: 1,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 7 }),
                        ]
                    }),
                    new Tier({
                        number: 2,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 1, targetBuilding: 7 }),
                        ]
                    }),
                    new Tier({
                        number: 3,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 2, targetBuilding: 7 }),
                        ]
                    }),
                    new Tier({
                        number: 4,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 5, targetBuilding: 7 }),
                        ]
                    }),
                    new Tier({
                        number: 5,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 15, targetBuilding: 7 }),
                        ]
                    }),
                    new Tier({
                        number: 6,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 30, targetBuilding: 7 }),
                        ]
                    }),
                    new Tier({
                        number: 7,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 50, targetBuilding: 7 }),
                        ]
                    }),
                    new Tier({
                        number: 8,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 100, targetBuilding: 7 }),
                        ]
                    }),
                    new Tier({
                        number: 9,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 150, targetBuilding: 7 }),
                        ]
                    }),
                    new Tier({
                        number: 10,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 250, targetBuilding: 7 }),
                        ]
                    }),
                    new Tier({
                        number: 11,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 500, targetBuilding: 7 }),
                        ]
                    }),
                    new Tier({
                        number: 12,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 1000, targetBuilding: 7 }),
                        ]
                    }),
                    new Tier({
                        number: 13,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 3000, targetBuilding: 7 }),
                        ]
                    }),
                    new Tier({
                        number: 14,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 5000, targetBuilding: 7 }),
                        ]
                    }),
                    new Tier({
                        number: 15,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 10000, targetBuilding: 7 }),
                        ]
                    }),
                ]
            }),
            new Upgrade({
                id: 8,
                icon: 'forge',
                baseCost: 1e9,
                tiers: [
                    new Tier({
                        number: 1,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, calculateAsPercent: true, targetBuilding: 8 }),
                        ]
                    }),
                    new Tier({
                        number: 2,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 1, targetBuilding: 8 }),
                        ]
                    }),
                    new Tier({
                        number: 3,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 2, targetBuilding: 8 }),
                        ]
                    }),
                    new Tier({
                        number: 4,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 5, targetBuilding: 8 }),
                        ]
                    }),
                    new Tier({
                        number: 5,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 15, targetBuilding: 8 }),
                        ]
                    }),
                    new Tier({
                        number: 6,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 30, targetBuilding: 8 }),
                        ]
                    }),
                    new Tier({
                        number: 7,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 50, targetBuilding: 8 }),
                        ]
                    }),
                    new Tier({
                        number: 8,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 100, targetBuilding: 8 }),
                        ]
                    }),
                    new Tier({
                        number: 9,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 150, targetBuilding: 8 }),
                        ]
                    }),
                    new Tier({
                        number: 10,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 250, targetBuilding: 8 }),
                        ]
                    }),
                    new Tier({
                        number: 11,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 500, targetBuilding: 8 }),
                        ]
                    }),
                    new Tier({
                        number: 12,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 1000, targetBuilding: 8 }),
                        ]
                    }),
                    new Tier({
                        number: 13,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 3000, targetBuilding: 8 }),
                        ]
                    }),
                    new Tier({
                        number: 14,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 5000, targetBuilding: 8 }),
                        ]
                    }),
                    new Tier({
                        number: 15,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 10000, targetBuilding: 8 }),
                        ]
                    }),
                ]
            }),
            new Upgrade({
                id: 9,
                icon: 'wizard',
                baseCost: 1e10,
                tiers: [
                    new Tier({
                        number: 1,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 0.5, targetBuilding: 9 }),
                        ]
                    }),
                    new Tier({
                        number: 2,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 1, targetBuilding: 9 }),
                        ]
                    }),
                    new Tier({
                        number: 3,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 2, targetBuilding: 9 }),
                        ]
                    }),
                    new Tier({
                        number: 4,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 5, targetBuilding: 9 }),
                        ]
                    }),
                    new Tier({
                        number: 5,
                        levelUp: 1,
                        benefits: [
                            new Benefit({ coinsGain: 15, targetBuilding: 9 }),
                        ]
                    }),
                    new Tier({
                        number: 6,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 30, targetBuilding: 9 }),
                        ]
                    }),
                    new Tier({
                        number: 7,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 50, targetBuilding: 9 }),
                        ]
                    }),
                    new Tier({
                        number: 8,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 100, targetBuilding: 9 }),
                        ]
                    }),
                    new Tier({
                        number: 9,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 150, targetBuilding: 9 }),
                        ]
                    }),
                    new Tier({
                        number: 10,
                        levelUp: 2,
                        benefits: [
                            new Benefit({ coinsGain: 250, targetBuilding: 9 }),
                        ]
                    }),
                    new Tier({
                        number: 11,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 500, targetBuilding: 9 }),
                        ]
                    }),
                    new Tier({
                        number: 12,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 1000, targetBuilding: 9 }),
                        ]
                    }),
                    new Tier({
                        number: 13,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 3000, targetBuilding: 9 }),
                        ]
                    }),
                    new Tier({
                        number: 14,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 5000, targetBuilding: 9 }),
                        ]
                    }),
                    new Tier({
                        number: 15,
                        levelUp: 3,
                        benefits: [
                            new Benefit({ coinsGain: 10000, targetBuilding: 9 }),
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