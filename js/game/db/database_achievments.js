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
                icon: 'buildings/inn_1',
            }),

            // Farm
            new Achievment({
                id: 3,
                icon: 'buildings/farm_1',
            }),

            // Sawmill
            new Achievment({
                id: 4,
                icon: 'buildings/sawmill_1',
            }),

            // Carpentry
            new Achievment({
                id: 5,
                icon: 'buildings/carpentry_1',
            }),

            // Tavern
            new Achievment({
                id: 6,
                icon: 'buildings/tavern_1',
            }),

            // Scout
            new Achievment({
                id: 7,
                icon: 'buildings/scout_1',
            }),

            // Shield Bearer
            new Achievment({
                id: 8,
                icon: 'buildings/shield_bearer_1',
            }),

            // Forge
            new Achievment({
                id: 9,
                icon: 'buildings/forge_1',
            }),

            // SWizard
            new Achievment({
                id: 10,
                icon: 'buildings/wizard_1',
            }),

            // Pimp my ride
            new Achievment({
                id: 20,
                icon: 'buildings/wizard_1',
                reachValue: 1,
                reachType: 'upgrade',
            }),

            // Inn - Tier 1
            new Achievment({
                id: 21,
                icon: 'buildings/inn_1',
                reachValue: 1,
                reachType: 'upgrade',
            }),

            // // Coins
            // new Achievment({
            //     id: 3,
            //     icon: 'coins',
            //     reachValue: 10,
            //     reachType: 'coin',
            // }),


            // // Coins
            // new Achievment({
            //     id: 4,
            //     icon: 'coins',
            //     reachValue: 100,
            //     reachType: 'idle',
            // }),

            // // Coins
            // new Achievment({
            //     id: 5,
            //     icon: 'coins',
            //     reachValue: 200,
            //     reachType: 'idle',
            // }),

            // new Achievment({
            //     id: 6,
            //     icon: 'coins',
            //     reachValue: 300,
            //     reachType: 'idle',
            // }),
        ];
    }

    getDB() {
        return this.#db;
    }
}


export default DbAchievments;