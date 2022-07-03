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
        const tier = upgrade.tiers[j];
        const benefits = tier.benefits;

        tier.quote = upgradeInfo.tiers.find((t) => t.id == tier.number).quote;

        for (let k = 0; k < benefits.length; k++) {
          const benefit = benefits[k];

          if (benefit.coinsGain > 0)
            benefit.description = langData.benefits.coinsGain.self;

          if (benefit.coinsGainMultiplier > 0)
            benefit.description = langData.benefits.coinsGainMultiplier.self;

          if (benefit.coinsBonusPerQuest > 0)
            benefit.description = langData.benefits.coinsBonusPerQuest.self;

          if (benefit.coinsMultiplierPerQuest > 0)
            benefit.description = langData.benefits.coinsMultiplierPerQuest.self;

        }
      }
    }
  }

  /**
   * Obtiene el template del botón de la mejora.
   * @param {Number}  id      Id de la mejora.
   * @param {Boolean} canBuy  Valor booleano que indica si se puede comprar o no la mejora.
   * @param {Number}  tier    Nivel de la mejora.
   * @returns {HTMLElement} Elemento HTML que representa la mejora como botón.
   */
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
    this.#upgradesDOM.find(`#upgrade-${id}-${tier} > div.upgrade-image`).css("background-image", `url('../img/buildings/${icon}.png')`);
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

  static isUnbuyable(availableUpgrade, upgradesOwned) {
    const ugpradesFiltered = upgradesOwned.filter((u) => u.id == availableUpgrade.id);
    const isUndefined = ugpradesFiltered?.find((t) => t.tier == availableUpgrade.tier - 1) === undefined;
    return availableUpgrade.tier == 1 ? false : isUndefined;
  }

  static getMaxLevelByBuilding(buildingId, upgradesOwned) {
    const ugpradesFiltered = upgradesOwned.filter((u) => u.id == buildingId);
    return ugpradesFiltered?.sort((a, b) => b.tier - a.tier)[0]?.levelUp ?? 1;
  }

  /**
   * Obtiene el nombre del nivel de la mejora.
   * @param {String} tierNumber Nivel de la mejora.
   * @returns {String} Nombre de la mejora.
   */
  static getTierName(tierNumber) {
    const langData = LanguageManager.getData();
    switch (tierNumber) {
      case 1:
        return langData.tiers.handmade;
      case 2:
        return langData.tiers.poor;
      case 3:
        return langData.tiers.veryCommon;
      case 4:
        return langData.tiers.common;
      case 5:
        return langData.tiers.frequent;
      case 6:
        return langData.tiers.uncommon;
      case 7:
        return langData.tiers.rare;
      case 8:
        return langData.tiers.veryRare;
      case 9:
        return langData.tiers.extremelyRare;
      case 10:
        return langData.tiers.epic;
      case 11:
        return langData.tiers.legendary;
      case 12:
        return langData.tiers.mythic;
      case 13:
        return langData.tiers.marvelous;
      case 14:
        return langData.tiers.superb;
      case 15:
        return langData.tiers.outstanding;

      default:
        return langData.tiers.handmade;
    }
  }

  /**
   * Obtiene el nombre del nivel de la mejora con un estilo aplicado.
   * @param {String} tierNumber Nivel de la mejora.
   * @returns {HTMLElement} Elemento HTML con estilo aplicado.
   */
  static getTierNameFormatted(tierNumber) {
    switch (tierNumber) {
      case 1:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-handmade', 'white');
      case 2:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-poor', 'black');
      case 3:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-very-common', 'white');
      case 4:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-common', 'white');
      case 5:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-frequent', 'black');
      case 6:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-uncommon', 'black');
      case 7:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-rare', 'white');
      case 8:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-very-rare', 'white');
      case 9:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-extremely-rare', 'white');
      case 10:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-epic', 'white');
      case 11:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-legendary', 'white');
      case 12:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-mythic', 'black');
      case 13:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-marvelous', 'black');
      case 14:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-superb', 'white');
      case 15:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-outstanding', 'mintcream');

      default:
        return this.#getTierHTML(this.getTierName(tierNumber), '--tier-handmade', 'white');
    }
  }

  /**
   * Obtiene un elemento HTML que representa la rareza de una tier.
   * @param {String}  text            Rareza.
   * @param {String}  backgroundColor Color de fondo.
   * @param {String}  textColor       Color de texto.
   * @returns {HTMLElement} Elemento HTML con estilo aplicado.
   */
  static #getTierHTML(text, backgroundColor, textColor) {
    let background = backgroundColor == '--tier-outstanding' ? 'background-image' : 'background-color';
    let textShadow = (backgroundColor == '--tier-outstanding' || textColor == 'white') ? '1px 1px 2px black' : 'none';
    return `<span style=' border: 1px solid var(--building-section);
                          font-family: Arial, Helvetica, sans-serif;
                          font-size: x-small;
                          text-shadow: ${textShadow};
                          border-radius: 0px 10px 10px 0px;
                          font-weight: normal;
                          color: ${textColor};
                          ${background}: var(${backgroundColor});
                          letter-spacing: 0;
                          padding: 2px 7px 3px 5px'>${text}</span>`;

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