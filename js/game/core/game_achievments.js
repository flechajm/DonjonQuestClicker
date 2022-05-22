import DbAchievments from "../db/database_achievments.js";
import GameLog from "./game_log.js";

class GameAchievments {
    #achievments = [];

    constructor(achievments) {
        this.#achievments = new DbAchievments().getDB();
        this.unlockeds = achievments?.unlockeds ?? [];
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
}

export default GameAchievments;