import Upgrade from "./upgrade.js";
import Benefit from "./benefit.js";
import Tier from "./tier.js";

import LanguageManager from "../../libs/language_manager.js";

/**
 * Clase que maneja todas las mejoras del juego.
 */
class GameUpgrades {
  /**
   * Representa el elemento DOM '#upgrades'.
   */
  static #upgradesDOM;

  /**
   * Lista de mejoras disponibles en el juego.
   */
  static #upgrades = [];

  /**
   * Instancia todos los edificios y mejoras.
   */
  static create() {
    this.#upgradesDOM = $("#store-wrap").find('#upgrades > div.container');

    this.#upgrades.push(
      new Upgrade({
        id: 1,
        cost: 100,
        tiers: [
          new Tier({
            number: 1,
            benefits: [
              new Benefit({ coinsGain: 0.5 }),
            ]
          }),
          new Tier({
            number: 2,
            benefits: [
              new Benefit({ coinsGain: 0.5 }),
            ]
          }),
          new Tier({
            number: 3,
            benefits: [
              new Benefit({ coinsGain: 0.5 }),
            ]
          }),
        ]
      }),
      new Upgrade({
        id: 2,
        cost: 100,
        tiers: [
          new Tier({
            number: 1,
            benefits: [
              new Benefit({ coinsGain: 0.5 }),
            ]
          }),
        ]
      }),
    )

    this.#populateUpgrades();
  }

  /**
   * Prepara las mejoras con todos los datos disponibles.
   */
  static #populateUpgrades() {
    for (let i = 1; i < this.#upgrades.length + 1; i++) {
      const upgrade = this.getUpgradeById(i);
      const upgradeInfo = LanguageManager.getData().store.upgrades.find((b) => b.id == upgrade.id);

      upgrade.name = upgradeInfo.name;
      upgrade.description = upgradeInfo.description;
      upgrade.quote = upgradeInfo.quote;

      for (let j = 0; j < upgrade.tiers.length; j++) {
        const benefits = upgrade.tiers[j].benefits;

        for (let k = 0; k < benefits.length; k++) {
          const benefit = benefits[k];
          const varColor = 'benefit';
          const replaceValue = benefit.getFormattedValue(benefit.getValue(), varColor);

          if (benefit.coinsGain > 0)
            benefit.description = String(LanguageManager.getData().benefits.coinsGain).replace('{g}', replaceValue);

          if (benefit.coinsGainMultiplier > 0)
            benefit.description = String(LanguageManager.getData().benefits.coinsGainMultiplier).replace('{g}', replaceValue);

          if (benefit.coinsBonusPerQuest > 0)
            benefit.description = String(LanguageManager.getData().benefits.coinsBonusPerQuest).replace('{g}', replaceValue);

          if (benefit.coinsMultiplierPerQuest > 0)
            benefit.description = String(LanguageManager.getData().benefits.coinsMultiplierPerQuest).replace('{g}', replaceValue);

        }

      }
    }
  }

  static #getButtonUpgradeTemplate(id, canBuy, tier) {
    let classTier = this.#getTierClass(tier);
    return `<div id="upgrade-${id}-${tier}" class="upgrade-button tier ${classTier} ${canBuy ? "" : "disabled"}">
              <div class="upgrade-image"></div>
            </div>`;
  }

  /**
   * 
   * @param {Number}  id      Representa el ID de la mejora.
   * @param {Boolean} canBuy  Indica si la mejora se puede comprar o no.
   * @param {Number}  tier    Tier (rareza) de la mejora.
   */
  static unlockUpgrade({ id, canBuy, tier }) {
    this.#upgradesDOM.append(this.#getButtonUpgradeTemplate(id, canBuy, tier));
    this.#upgradesDOM.find(`#upgrade-${id}-${tier} > div.upgrade-image`).css("background-image", `url('/img/buildings/${id}.png')`);
  }

  /**
 * Obtiene una mejora mediante su Id.
 * @param {Number} id Id de la mejora.
 * @returns {Upgrade} Mejora.
 */
  static getUpgradeById(id) {
    return this.#upgrades.find((b) => b.id == id);
  }

  static #getTierClass(tierNumber) {
    switch (tierNumber) {
      case 1:
        return 'one';
      case 2:
        return 'two';
      case 3:
        return 'three';
      case 4:
        return 'four';
      case 5:
        return 'five';
      case 6:
        return 'six';
      case 7:
        return 'seven';
      case 8:
        return 'eight';
      case 9:
        return 'nine';
      case 10:
        return 'ten';

      default:
        return 'one';
    }
  }
}

export default GameUpgrades;