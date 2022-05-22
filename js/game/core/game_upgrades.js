import Upgrade from "./buildings/upgrade.js";
import DbUpgrades from "../db/database_upgrades.js";

import LanguageManager from "../libs/language_manager.js";

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
    this.#upgrades = new DbUpgrades().getDB();
    this.#populateUpgrades();
  }

  /**
   * Prepara las mejoras con todos los datos disponibles.
   */
  static #populateUpgrades() {
    const langData = LanguageManager.getData();

    for (let i = 1; i < this.#upgrades.length + 1; i++) {
      const upgrade = this.getUpgradeById(i);
      const upgradeInfo = langData.store.upgrades.find((b) => b.id == upgrade.id);

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
            benefit.description = String(langData.benefits.coinsGain.self).replace('{g}', replaceValue).replace(' ({t})', '');

          if (benefit.coinsGainMultiplier > 0)
            benefit.description = String(langData.benefits.coinsGainMultiplier).replace('{g}', replaceValue).replace(' ({t})', '');

          if (benefit.coinsBonusPerQuest > 0)
            benefit.description = String(langData.benefits.coinsBonusPerQuest).replace('{g}', replaceValue).replace(' ({t})', '');

          if (benefit.coinsMultiplierPerQuest > 0)
            benefit.description = String(langData.benefits.coinsMultiplierPerQuest).replace('{g}', replaceValue).replace(' ({t})', '');

        }

      }
    }
  }

  static #getButtonUpgradeTemplate(id, canBuy, tier) {
    let tierClass = this.getTierClass(tier);
    return `<div id="upgrade-${id}-${tier}" class="upgrade-button tier ${tierClass} ${canBuy ? "" : "disabled-tara"}">
                <div class="upgrade-image"></div>
            </div>`;
  }

  /**
   * 
   * @param {Number}  id      Representa el ID de la mejora.
   * @param {Boolean} canBuy  Indica si la mejora se puede comprar o no.
   * @param {Number}  tier    Nivel de la mejora.
   */
  static unlockUpgrade({ id, canBuy, tier, icon }) {
    this.#upgradesDOM.append(this.#getButtonUpgradeTemplate(id, canBuy, tier));
    this.#upgradesDOM.find(`#upgrade-${id}-${tier} > div.upgrade-image`).css("background-image", `url('/img/buildings/${icon}.png')`);
  }

  /**
   * Obtiene una mejora mediante su Id.
   * @param {Number} id Id de la mejora.
   * @returns {Upgrade} Mejora.
   */
  static getUpgradeById(id) {
    return this.#upgrades.find((u) => u.id == id);
  }

  /**
   * Obtiene una Tier a través de su Upgrade y su Tier number.
   * @param {Upgrade} upgrade     Mejora
   * @param {Number}  tierNumber  Tier number de la mejora.
   * @returns {Tier} Tier de la mejora.
   */
  static getTierByUpgrade(upgrade, tierNumber) {
    return upgrade.tiers.find((t) => t.number == tierNumber);
  }

  /**
   * Obtiene la cantidad de mejoras.
   * @returns {Number} Cantidad de mejoras.
   */
  static getCount() {
    return this.#upgrades.length;
  }

  /**
   * Obtiene el nombre de la Tier de la mejora.
   * @param {Int} tierNumber Número de tier de la mejora.
   * @returns {String} Nombre de la mejora.
   */
  static getTierName(tierNumber) {
    const langData = LanguageManager.getData();
    switch (tierNumber) {
      case 1:
        return this.#getTierFormatted(langData.tiers.handmade, '--tier-handmade', 'white');
      case 2:
        return this.#getTierFormatted(langData.tiers.poor, '--tier-poor', 'black');
      case 3:
        return this.#getTierFormatted(langData.tiers.veryCommon, '--tier-very-common', 'black');
      case 4:
        return this.#getTierFormatted(langData.tiers.common, '--tier-common', 'white');
      case 5:
        return this.#getTierFormatted(langData.tiers.frequent, '--tier-frequent', 'black');
      case 6:
        return this.#getTierFormatted(langData.tiers.uncommon, '--tier-uncommon', 'black');
      case 7:
        return this.#getTierFormatted(langData.tiers.rare, '--tier-rare', 'white');
      case 8:
        return this.#getTierFormatted(langData.tiers.veryRare, '--tier-very-rare', 'white');
      case 9:
        return this.#getTierFormatted(langData.tiers.extremelyRare, '--tier-extremely-rare', 'white');
      case 10:
        return this.#getTierFormatted(langData.tiers.epic, '--tier-epic', 'white');
      case 11:
        return this.#getTierFormatted(langData.tiers.legendary, '--tier-legendary', 'white');
      case 12:
        return this.#getTierFormatted(langData.tiers.mythic, '--tier-mythic', 'black');
      case 13:
        return this.#getTierFormatted(langData.tiers.marvelous, '--tier-marvelous', 'black');
      case 14:
        return this.#getTierFormatted(langData.tiers.superb, '--tier-superb', 'white');
      case 15:
        return this.#getTierFormatted(langData.tiers.outstanding, '--tier-outstanding', 'black');

      default:
        return this.#getTierFormatted(langData.tiers.handmade, '--tier-handmade', 'white');
    }
  }

  static #getTierFormatted(text, backgroundColor, textColor) {
    let background = backgroundColor == '--tier-outstanding' ? 'background-image' : 'background-color';
    let textShadow = backgroundColor == '--tier-outstanding' ? '0px 0px 1px black' : 'none';
    return `<span style=' border: 1px solid var(--building-section);
                          font-family: Arial, Helvetica, sans-serif;
                          font-size: x-small;
                          text-shadow: ${textShadow};
                          border-radius: 3px;
                          color: ${textColor};
                          ${background}: var(${backgroundColor});
                          padding: 2px 5px 2px 5px'>${text}</span>`;
  }

  /**
   * Obtiene la clase CSS de la tier del upgrade.
   * @param {Number} tierNumber Número de tier.
   * @returns Clase CSS.
   */
  static getTierClass(tierNumber) {
    switch (tierNumber) {
      case 1:
        return 'handmade';
      case 2:
        return 'poor';
      case 3:
        return 'very-common';
      case 4:
        return 'common';
      case 5:
        return 'frequent';
      case 6:
        return 'uncommon';
      case 7:
        return 'rare';
      case 8:
        return 'very-rare';
      case 9:
        return 'extremely-rare';
      case 10:
        return 'epic';
      case 11:
        return 'legendary';
      case 12:
        return 'mythic';
      case 13:
        return 'marvelous';
      case 14:
        return 'superb';
      case 15:
        return 'outstanding';

      default:
        return 'handmade';
    }
  }
}

export default GameUpgrades;