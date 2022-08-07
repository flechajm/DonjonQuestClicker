import Building from "./buildings/building.js";
import DbBuildings from "../db/database_buildings.js";

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

        if (benefit.coinsGain > 0) {
          if (benefit.targetBuilding) {
            benefit.description = langData.benefits.coinsGain.toBuilding;
          } else {
            benefit.description = langData.benefits.coinsGain.self;
          }
        }

        if (benefit.coinsGainMultiplier > 0) {
          if (benefit.targetBuilding) {
            benefit.description = langData.benefits.coinsGainMultiplier.toBuilding;
          } else {
            benefit.description = langData.benefits.coinsGainMultiplier.self;
          }
        }

        if (benefit.coinsBonusPerQuest > 0) {
          if (benefit.targetBuilding) {
            benefit.description = langData.benefits.coinsBonusPerQuest.toBuilding;
          } else {
            benefit.description = langData.benefits.coinsBonusPerQuest.self;
          }
        }

        if (benefit.coinsMultiplierPerQuest > 0) {
          if (benefit.targetBuilding) {
            benefit.description = langData.benefits.coinsMultiplierPerQuest.toBuilding;
          } else {
            benefit.description = langData.benefits.coinsMultiplierPerQuest.self;
          }
        }
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
   * @param {Number}  level       Nivel del edificio.
   * @param {Number}  countOwned  Cantidad de edificios ya comprados.
   * @param {Boolean} canBuy      Indica si el edificio se puede comprar o no.
   * @returns {String} Código HTML.
   */
  static unlockBuilding({ id, name, cost, countOwned, canBuy, icon }) {
    this.#buildingsDOM.append(this.#getButtonBuildingTemplate(id, name, cost, countOwned, canBuy));
    this.#buildingsDOM.find(`#building-${id} > div.building-image`).css("background-image", `url('img/buildings/${icon}.png')`);
    this.resizeToFit(id);
  }

  static updateImage(id) {
    const building = this.getBuildingById(id);
    this.#buildingsDOM.find(`#building-${id} > div.building-image`).css("background-image", `url('img/buildings/${building.icon}_${building.level}.png')`);
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

  static filterByTargetBuilding(targetBuildingId) {
    return this.#buildings.filter((building) => building.benefits.find((benefit) => benefit.targetBuilding == targetBuildingId));
  }

  static getFormattedName(name, color, icon) {
    return `<span>
              <img  src='./img/buildings/${icon}.png' title=''
                    style="width: 16px;
                          height: 16px;
                          margin-left: 2px;
                          margin-right: 1px;
                          margin-top: -100%;
                          transform: scale(1.1) translate(0, 4px);
                          -webkit-filter: drop-shadow(0px 0px 3px #000);
                          filter: drop-shadow(0px 0px 3px #000);" />
            </span>
            <span style='color: var(--${color});'><b>${name}</b></span>`;
  }
}

export default GameBuildings;