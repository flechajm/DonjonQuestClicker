import Building from "./buildings/building.js";
import DbBuildings from "./buildings/db/database_buildings.js";

import LanguageManager from "../libs/language_manager.js";


/**
 * Clase que maneja todos los edificios del juego.
 */
class GameBuildings {
  /**
   * Representa el elemento DOM '#buildings'.
   */
  static #buildingsDOM;

  /**
   * Lista de edificios disponibles en el juego.
   */
  static #buildings = [];

  /**
   * Instancia todos los edificios y mejoras.
   */
  static create() {
    this.#buildingsDOM = $("#store-wrap").find('#buildings > div.container');
    this.#buildings = new DbBuildings().getDB();
    this.#populateBuildings();
  }

  /**
   * Prepara los edificios con todos los datos disponibles.
   */
  static #populateBuildings() {
    const langData = LanguageManager.getData();

    for (let i = 1; i < this.#buildings.length + 1; i++) {
      const building = this.getBuildingById(i);
      const buildingInfo = langData.store.buildings.find((b) => b.id == building.id);

      building.name = buildingInfo.name;
      building.description = buildingInfo.description;
      building.quote = buildingInfo.quote;

      for (let j = 0; j < building.benefits.length; j++) {
        const benefit = building.benefits[j];
        const varColor = 'benefit';
        const replaceValue = benefit.getFormattedValue(benefit.getValue(), varColor);

        if (benefit.coinsGain > 0)
          benefit.description = String(langData.benefits.coinsGain).replace('{g}', replaceValue);

        if (benefit.coinsGainMultiplier > 0)
          benefit.description = String(langData.benefits.coinsGainMultiplier).replace('{g}', replaceValue);

        if (benefit.coinsBonusPerQuest > 0)
          benefit.description = String(langData.benefits.coinsBonusPerQuest).replace('{g}', replaceValue);

        if (benefit.coinsMultiplierPerQuest > 0)
          benefit.description = String(langData.benefits.coinsMultiplierPerQuest).replace('{g}', replaceValue);
      }
    }
  }

  /**
   * Obtiene código HTML que representa el botón completo para comprar el edificio.
   *
   * @param {Number}  id          Representa el ID del edificio.
   * @param {String}  name        Nombre del edificio.
   * @param {Number}  cost        Costo del edificio.
   * @param {Number}  countOwned  Cantidad de edificios ya comprados.
   * @param {Boolean} canBuy      Indica si el edificio se puede comprar o no.
   * @returns {String} Código HTML.
   */
  static #getButtonBuildingTemplate(id, name, cost, countOwned, canBuy) {
    return `<div id="building-${id}" class="building-button ${canBuy ? "" : "disabled"}">
              <div class="building-image"></div>
              <div class="building-header">
                <div class="building-name">${name}</div>
                <div class="building-cost">${cost}</div>
              </div>
              <div class="building-count-owned">${countOwned ?? ""}</div>
            </div>`;
  }

  /**
   * Obtiene código HTML que representa el botón completo para comprar el edificio.
   *
   * @param {Number}  id          Representa el ID del edificio.
   * @param {String}  name        Nombre del edificio.
   * @param {Number}  cost        Costo del edificio.
   * @param {Number}  countOwned  Cantidad de edificios ya comprados.
   * @param {Boolean} canBuy      Indica si el edificio se puede comprar o no.
   * @returns {String} Código HTML.
   */
  static unlockBuilding({ id, name, cost, countOwned, canBuy, icon }) {
    this.#buildingsDOM.append(this.#getButtonBuildingTemplate(id, name, cost, countOwned, canBuy));
    this.#buildingsDOM.find(`#building-${id} > div.building-image`).css("background-image", `url('/img/buildings/${icon}.png')`);
    this.resizeToFit(id);
  }

  /**
   * Ajusta el nombre del edificio para que quepa en el ancho del botón.
   * @param {Number} id Id del edificio.
   */
  static resizeToFit(id) {
    let building = $(`#building-${id}`);
    let buildingName = building.find("div.building-name");
    let fontSize = buildingName.css("font-size");

    buildingName.css("font-size", parseFloat(fontSize) - 1);

    if (buildingName.height() >= building.height()) {
      this.resizeToFit(id);
    }
  }

  /**
   * Agrega un edificio bloqueado.
   */
  static insertLockedBuilding() {
    this.#buildingsDOM.append(`<div id="building-locked" class="building-button locked"></div>`);
  }

  /**
   * Indica si el edificio está desbloqueado.
   * @param {Number} id Id del edificio.
   * @returns {Boolean} Valor booleano que indica si el edificio está desbloqueado.
   */
  static isUnlocked(id) {
    return $(`#building-${id}`).length == 1;
  }

  /**
   * Obtiene la cantidad de edificios.
   * @returns {Number} Cantidad de edificios.
   */
  static getCount() {
    return this.#buildings.length;
  }

  /**
   * Obtiene un edificio mediante su Id.
   * @param {Number} id Id del edificio.
   * @returns {Building} Edificio.
   */
  static getBuildingById(id) {
    return this.#buildings.find((b) => b.id == id);
  }
}

export default GameBuildings;