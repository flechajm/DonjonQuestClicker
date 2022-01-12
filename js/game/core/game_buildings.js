class GameBuildings {
  /**
   * Representa el elemento DOM '#store-wrap'.
   */
  static #store;

  /**
   * Lista de edificios disponibles en el juego.
   */
  static #buildings = [];

  /**
   * Instancia todos los edificios y mejoras.
   */
  static create() {
    this.#store = $("#store-wrap");
    this.#buildings.push(
      new Building({
        id: 1,
        baseCost: 15,
        benefits: [
          new Benefit({
            coinsGain: 0.5,
          }),
        ],
      }),
      new Building({
        id: 2,
        baseCost: 100,
        benefits: [
          new Benefit({
            coinsGain: 1,
          }),
          new Benefit({
            coinsBonusPerQuest: 1,
          }),
        ],
      }),
      new Building({
        id: 3,
        baseCost: 1500,
        benefits: [
          new Benefit({
            coinsGain: 5,
          }),
        ],
      }),
      new Building({
        id: 4,
        baseCost: 15000,
        benefits: [
          new Benefit({
            coinsGain: 10,
          }),
          new Benefit({
            coinsMultiplierPerQuest: 0.05,
          }),
        ],
      })
    );

    for (let i = 1; i < this.#buildings.length + 1; i++) {
      const building = this.getById(i);
      const buildingInfo = LanguageManager.getData().store.buildings.find((b) => b.id == building.id);

      building.name = buildingInfo.name;
      building.description = buildingInfo.description;
      building.quote = buildingInfo.quote;

      for (let j = 0; j < building.benefits.length; j++) {
        const benefit = building.benefits[j];
        const benefitInfo = buildingInfo.benefits[j];

        benefit.description = benefitInfo.description;
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
  static #getButtonTemplate(id, name, cost, countOwned, canBuy) {
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
  static unlockBuilding({ id, name, cost, countOwned, canBuy }) {
    this.#store.append(this.#getButtonTemplate(id, name, cost, countOwned, canBuy));
    this.#store.find(`#building-${id} > div.building-image`).css("background-image", `url('/img/buildings/${id}.png')`);
    this.resizeToFit(id);
  }

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
    this.#store.append(`<div id="building-locked" class="building-button locked"></div>`);
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
  static getById(id) {
    return this.#buildings.find((b) => b.id == id);
  }
}

/**
 * Clase que representa un edificio o mejora.
 */
class Building {
  /**
   * Crea la instancia de Building.
   * @param {Number}  id          Id del edificio o mejora.
   * @param {String}  name        Nombre del edificio o mejora.
   * @param {String}  description Descripción del edificio o mejora.
   * @param {Number}  baseCost    Costo base del edificio o mejora. Es el costo incial.
   * @param {Number}  cost        Costo actual del edificio o mejora. Es el costo que crece exponencialmente.
   * @param {Benefit} benefits    Beneficios del edificio o mejora.
   * @param {String}  image       Imagen descriptiva del edificio o mejora.
   * @param {String}  quote       Cita.
   */
  constructor({ id, name, description, baseCost, cost, benefits, image, quote }) {
    /**
     * Id del edificio o mejora.
     */
    this.id = id;

    /**
     * Nombre del edificio o mejora.
     */
    this.name = name;

    /**
     * Descripción del edificio o mejora.
     */
    this.description = description;

    /**
     * Costo base del edificio o mejora. Es el costo incial.
     */
    this.baseCost = baseCost;

    /**
     * Costo actual del edificio o mejora. Es el costo que crece exponencialmente.
     */
    this.cost = cost ?? baseCost;

    /**
     * Beneficios del edificio o mejora.
     */
    this.benefits = benefits;

    /**
     * Imagen descriptiva del edificio o mejora.
     */
    this.image = image;

    /**
     * Cita.
     */
    this.quote = quote;
  }
}

/**
 * Clase que representa un Beneficio para un edificio o mejora.
 */
class Benefit {
  /**
   * Crea una instancia de Benefit.
   * @param {String} description              Descripción del beneficio.
   * @param {Number} coinsGain                Ganancia de monedas por segundo.
   * @param {Number} coinsGainMultiplier      Multiplicador de ganancia de monedas por segundo.
   * @param {Number} coinsBonusPerQuest       Ganancia de monedas por quest.
   * @param {Number} coinsMultiplierPerQuest  Multiplicador de ganancia de monedas por quest.
   */
  constructor({ description, coinsGain, coinsGainMultiplier, coinsBonusPerQuest, coinsMultiplierPerQuest }) {
    /**
     * Descripción del beneficio.
     */
    this.description = description;

    /**
     * Ganancia de monedas por segundo.
     */
    this.coinsGain = coinsGain ?? 0;

    /**
     * Multiplicador de ganancia de monedas por segundo.
     */
    this.coinsGainMultiplier = coinsGainMultiplier ?? 0;

    /**
     * Ganancia de monedas por quest.
     */
    this.coinsBonusPerQuest = coinsBonusPerQuest ?? 0;

    /**
     * Multiplicador de ganancia de monedas por quest.
     */
    this.coinsMultiplierPerQuest = coinsMultiplierPerQuest ?? 0;
  }
}
