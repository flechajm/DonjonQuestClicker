import LanguageManager from "../libs/language_manager.js";

class GameRandomizer {
    #langData;
    #kills = [];
    #folks = [];
    #addressees = [];
    #deliverables = [];
    #pets = [];
    #locations = [];
    #monsters = [];
    #quests = [];

    constructor() {
        this.#langData = LanguageManager.getData();

        this.#kills.push(...this.#langData.dictionaries.kills);
        this.#folks.push(...this.#langData.dictionaries.folks);
        this.#addressees.push(...this.#langData.dictionaries.addressees);
        this.#deliverables.push(...this.#langData.dictionaries.deliverables);
        this.#pets.push(...this.#langData.dictionaries.pets);
        this.#locations.push(...this.#langData.dictionaries.locations);
        this.#monsters.push(...this.#langData.dictionaries.monsters);
        this.#quests.push(...this.#langData.dictionaries.quests);
    }

    getRandomQuest(reward) {
        let quest = this.#buildQuest(this.#getRandom(this.#quests), reward);
        return quest;
    }

    #buildQuest(quest, reward) {
        let rewardText = this.#langData.dictionaries.reward.replace('{g}', reward);

        quest = quest.replace('{kill}', `<span>${this.#getRandom(this.#kills)}</span>`);
        quest = quest.replace('{folk}', `<span>${this.#getRandom(this.#folks)}</span>`);
        quest = quest.replace('{addressee}', `<span>${this.#getRandom(this.#addressees)}</span>`);
        quest = quest.replace('{deliverable}', `<span>${this.#getRandom(this.#deliverables)}</span>`);
        quest = quest.replace('{pet}', `<span>${this.#getRandom(this.#pets)}</span>`);
        quest = quest.replace('{location}', `<span>${this.#getRandom(this.#locations)}</span>`);
        quest = quest.replace('{monster}', `<span>${this.#getRandom(this.#monsters)}</span>`);

        return `<br />Quest: <span class='console random-quest'>${quest}</span><br />Recompensa: <span class='coins-info'>${rewardText}</span>`;
    }

    #getRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

export default GameRandomizer;