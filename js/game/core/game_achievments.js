import DbAchievments from "../db/database_achievments.js";
import GameLog from "./game_log.js";

import LanguageManager from "../libs/language_manager.js";

class GameAchievments {
    #achievments = [];

    constructor(achievments) {
        this.#achievments = new DbAchievments().getDB();
        this.unlockeds = achievments?.unlockeds.sort((a, b) => a - b) ?? [];
    }

    unlock(id) {
        const achievment = this.#achievments.find((a) => a.id == id);
        const isUnlocked = this.unlockeds.some((a) => a == id);
        if (achievment && !isUnlocked) {
            GameLog.write(`<div class='achievment-unlocked'>¡Logro desbloqueado🎉!</div>`)
            GameLog.write(`<div class='achievment'>
                                <div class='icon'><img src='/img/${achievment.icon}.png' /></div>
                                <div>
                                    <div class='title'>${achievment.title}</div>
                                    <div class='subtitle'>${achievment.description}</div>
                                </div>
                            </div>`);

            this.unlockeds.push(achievment.id);
        }
    }

    setLocalization() {
        const langData = LanguageManager.getData();

        this.#achievments.forEach((achievment) => {
            const achievmentInfo = langData.achievments.find((a) => a.id == achievment.id);
            if (achievmentInfo) {
                achievment.title = achievmentInfo.title;
                achievment.description = achievmentInfo.description;
            }
        });
    }

    searchByReachType(type) {
        return this.#achievments.filter((a) => a.reachType == type);
    }
}

export default GameAchievments;