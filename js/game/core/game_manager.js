import GameConfig from "./game_config.js";
import GameLoop from "./game_loop.js";
import GameLog from "./game_log.js";
import GameBuildings from "./game_buildings.js";
import GameUpgrades from "./game_upgrades.js";
import GameAchievments from "./game_achievments.js";
import GameInfo from "./game_info.js";
import GameEffects from "./game_effects.js";

import LanguageManager from "../libs/language_manager.js";
import Tooltip from "../libs/tooltip.js";
import Benefit from "./buildings/benefit.js";
import { audioManager } from "../main.js";

/**
 * Clase encargada del manejo del juego.
 */
class GameManager {
  #basePow;
  #basePowUpgrades;
  #units;
  #showTooltipChest;
  #showCoinsGainDetail;
  #blinkTimeout;

  /**
   * 
   * @param {String}          heroName                 Nombre del jugador que aparecerá en pantalla.
   * @param {Number}          coins                    Monedas de oro del momento.
   * @param {Number}          coinsGain                Ganancia de monedas de oro por segundo.
   * @param {Number}          coinsGainMultiplier      Multiplicador de ganancia de monedas de oro por segundo.
   * @param {Number}          coinsPerQuest            Monedas de oro base por quest.
   * @param {Number}          coinsBonusPerQuest       Ganancia de monedas de oro extra por quest.
   * @param {Number}          coinsMultiplierPerQuest  Multiplicador de ganancia de monedas de oro por quest.
   * @param {Number}          coinsHistory             Total de monedas de oro acumuladas desde que comenzó el juego.
   * @param {Number}          clicksHistory            Total de clicks hechos en el cofre desde comenzó el juego.
   * @param {Object}          buildingsOwned           Edificios obtenidos (comprados).
   * @param {Object}          upgradesOwned            Mejoras obtenidas (compradas).
   * @param {Object}          availableUpgrades        Mejoras disponibles para comprar.
   * @param {GameConfig}      config                   Configuración del juego.
   * @param {DateTime}        initDate                 Fecha y hora de inicio del juego.
   * @param {GameAchievments} achievments              Manejador de logros.
   */
  constructor({
    heroName,
    coins,
    coinsGain,
    coinsGainMultiplier,
    coinsPerQuest,
    coinsBonusPerQuest,
    coinsMultiplierPerQuest,
    coinsHistory,
    clicksHistory,
    buildingsOwned,
    upgradesOwned,
    availableUpgrades,
    config,
    initDate,
    achievments,
  }) {
    this.heroName = heroName ?? "John Arrow";
    this.coins = coins ?? 0;
    this.coinsGain = coinsGain ?? 0;
    this.coinsGainMultiplier = coinsGainMultiplier ?? 1;
    this.coinsPerQuest = coinsPerQuest ?? 1;
    this.coinsBonusPerQuest = coinsBonusPerQuest ?? 0;
    this.coinsMultiplierPerQuest = coinsMultiplierPerQuest ?? 1;
    this.coinsHistory = coinsHistory ?? 0;
    this.clicksHistory = clicksHistory ?? 0;
    this.buildingsOwned = buildingsOwned ?? [];
    this.upgradesOwned = upgradesOwned ?? [];
    this.availableUpgrades = availableUpgrades ?? [];
    this.config = new GameConfig(config);
    this.initDate = initDate;
    this.achievments = new GameAchievments(achievments);
    this.#basePow = 1.17;
    this.#basePowUpgrades = 1.5;
    this.#units = [];
    this.#showTooltipChest = true;
  }

  /**
   * Carga la configuración del juego.
   */
  async loadConfig() {
    await LanguageManager.setLanguage(this.config.lang);
  }

  /**
   * Comienza el juego.
   */
  start() {
    const gameManager = this;
    this.#initGameLoop();
    this.#setEvents();
    this.#configure();

    setInterval(function () {
      gameManager.updateTitle();
    }, 1000);

    this.gameLoop.gameLoop();
    this.gameLoop.saveLoop();
  }

  /**
   * Graba la fecha y hora en que se guardó el juego.
   * @param {DateTime} date Fecha de guardado.
   */
  setSaveDate(date) {
    this.config.saveDate = date;
  }

  /**
   * Obtiene la fecha y hora en la que se guardó el juego.
   * @returns {DateTime} Fecha de guardado.
   */
  getSaveDate() {
    return this.config.saveDate;
  }

  /**
   * Establece si se muestra el tooltip del cofre o no.
   * @param {Boolean} show Indica si se debe mostrar el tooltip.
   */
  setTooltipChest(show) {
    this.#showTooltipChest = show;
  }

  /**
   * Obtiene si el tooltip del cofre está visible o no.
   * @returns {Boolean} Visibilidad del tooltip.
   */
  getTooltipChest() {
    return this.#showTooltipChest;
  }

  setCoinsGainDetailed(show) {
    this.#showCoinsGainDetail = show;
  }

  getCoinsGainDetailed() {
    return this.#showCoinsGainDetail;
  }

  /**
   * Obtiene la clase del héroe.
   * @returns {String} Clase del héroe.
   */
  getSuffixHeroName() {
    return LanguageManager.getData().hero.class;
  }

  /**
   * Abre el cofre y obtiene la ganancia de monedas de oro correspondiente.
   * @param {Event} e Mouse event.
   */
  openChest(e) {
    this.clicksHistory++;
    let coinsEarned = Math.round((this.coinsPerQuest + this.coinsBonusPerQuest) * this.coinsMultiplierPerQuest);

    GameEffects.spawnCoinsEarned(e, this.#prettyNumber(coinsEarned));
    //GameEffects.spawnIconCoin(e);

    audioManager.play('click', 0.4);
    this.addCoins(coinsEarned);
  }

  /**
   * Agrega la cantidad de monedas de oro indicadas.
   * @param {Number}  quantity  Cantidad de monedas de oro a agregar.
   * @param {Boolean} isLoading Valor booleano que indica si el juego está cargando o no.
   */
  addCoins(quantity, isLoading) {
    if (!isLoading) {
      this.coins += quantity;
      this.coinsHistory += quantity;

      if (this.initDate == null) {
        this.initDate = new Date().getTime();
        this.achievments.unlock(1);
      }
    }

    $("#coins").html(`${this.getCoinsFormatted(true)} <span>${LanguageManager.getData().coins}</span>`);
    if (!this.getCoinsGainDetailed()) {
      this.showCoinsPerSec();
    } else {
      const coinsInfo = this.getGeneralStatistics();
      const event = Tooltip.getEvent();
      Tooltip.setTooltip({
        event: event,
        title: coinsInfo.title,
        subtitle: coinsInfo.subtitle,
        description: `<span class='coins-info'>${coinsInfo.coins}${this.drawDividerLines()}${coinsInfo.coinsGain}<br />${coinsInfo.coinsGainMultiplier}<br />${coinsInfo.coinsTotalPerSecond}${this.drawDividerLines()}${coinsInfo.coinsBonusPerQuest}<br />${coinsInfo.coinsMultiplierPerQuest}<br />${coinsInfo.coinsTotalPerQuest}${this.drawDividerLines()}${coinsInfo.coinsHistory}<br />${coinsInfo.clicksHistory}</span>`,
        icon: "img/stats.png",
        position: "bottom",
        width: 500,
        gameUnits: this.getUnits(),
      });
    }
  }

  /**
   * Muestra el oro por segundo final.
   */
  showCoinsPerSec() {
    $("#coins-per-sec").html(`${this.#prettyNumber((this.coinsGain * this.coinsGainMultiplier))} /s`);
  }

  /**
   * Obtiene el número de monedas de oro formateado a unidades.
   * @param {Boolean} returnPrettyNumber Valor booleano que indica si se debe retornar el número de monedas de oro formateado a unidades.
   * @returns {String} Monedas de oro formateadas.
   */
  getCoinsFormatted(returnPrettyNumber) {
    return returnPrettyNumber ? this.#prettyNumber(this.coins) : String(this.coins).commafy();
  }

  /**
   * Establece el nombre del jugador.
   * @param {String} name Nombre del jugador.
   */
  setHeroName(name) {
    this.heroName = name;
    $("#donjon-heroname p").html(this.heroName + this.getSuffixHeroName());
  }

  /**
   * Obtiene el nombre del jugador.
   * @returns {String} Nombre del jugador.
   */
  getHeroName() {
    return this.heroName;
  }

  /**
   * Actualiza el título del navegador con las monedas de oro actuales.
   */
  updateTitle() {
    if (this.coins > 0) {
      let preposition = this.config.lang == "es" ? "de" : "";
      document.title = `${this.getCoinsFormatted(true)} ${preposition} ${LanguageManager.getData().coins} - ${GameInfo.title
        }`;
    }
  }

  /**
   * Devuelve el número exponente.
   * @returns {Number} Número exponente.
   */
  getBasePow() {
    return this.#basePow;
  }

  /**
   * Verifica si hay edificios disponibles para comprar.
   */
  checkBuildingsAvailable() {
    const gameManager = this;
    let buildingsCount = GameBuildings.getCount() + 1;

    for (let i = 1; i < buildingsCount; i++) {
      const building = GameBuildings.getBuildingById(i);
      const button = $(`#building-${building.id}`);

      if (!button) return;

      // building.level = GameUpgrades.getMaxLevelByBuilding(building.id, this.upgradesOwned);
      // GameBuildings.updateImage(building.id);

      if (building.cost > gameManager.coins) {
        button.addClass("disabled");
        button.unbind("click");
        button.unbind("mouseenter");
      } else {
        Tooltip.updateCost(gameManager.coins);
        button.removeClass("disabled");
        button.unbind("click").click(function (e) {
          audioManager.play('click', 0.8);
          gameManager.buyBuilding(building.id, 1);
          gameManager.bindTooltipFunctionToBuildingButton(e, building);
          gameManager.checkBuildingsAvailable();
        }).unbind("mouseenter").mouseenter(function () {
          audioManager.play('mouse_hover', 1.8);
        });
      }

      button
        .unbind("mousemove")
        .mousemove(function (e) {
          gameManager.bindTooltipFunctionToBuildingButton(e, building);
        })
        .mouseout(function () {
          if (!Tooltip.getShiftPressed()) {
            Tooltip.hide();
          }
        });
    }
  }

  /**
   * Verifica si hay mejoras disponibles para comprar.
   */
  checkUpgradesAvailable() {
    const gameManager = this;

    for (let i = 0; i < this.availableUpgrades.length; i++) {
      const availableUpgrade = this.getAvailableUpgradeById(this.availableUpgrades[i]);
      if (!availableUpgrade) return;

      const upgrade = GameUpgrades.getUpgradeById(availableUpgrade.id);
      const tier = this.getTierCostUpdated(upgrade, availableUpgrade.tier);
      if (!tier) return;

      const button = $(`#upgrade-${availableUpgrade.id}-${availableUpgrade.tier}`);
      if (!button) return;

      const isUnbuyable = GameUpgrades.isUnbuyable(availableUpgrade, this.upgradesOwned);
      this.availableUpgrades[i].isUnbuyable = isUnbuyable;

      if (isUnbuyable || (tier.cost > gameManager.coins)) {
        button.addClass("disabled-tara");
        button.unbind("click");
        button.unbind("mouseenter");
      } else {
        Tooltip.updateCost(gameManager.coins);
        button.removeClass("disabled-tara");
        button.unbind("click").click(function (e) {
          audioManager.play('plop', 0.2);
          gameManager.buyUpgrarde(upgrade, tier);
          gameManager.checkUpgradesAvailable();
          gameManager.bindTooltipFunctionToUpgradeButton(e, upgrade, tier);
          gameManager.redrawUpgrades();
          Tooltip.hide();
        }).unbind("mouseenter").mouseenter(function () {
          audioManager.play('mouse_hover', 1.8);
        });
      }

      button
        .unbind("mouseover mousemove")
        .on('mouseover mousemove', function (e) {
          gameManager.bindTooltipFunctionToUpgradeButton(e, upgrade, tier);
        })
        .unbind("mouseout")
        .mouseout(function () {
          Tooltip.hide();
        });
    }
  }

  /**
   * Obtiene un edificio en posesión mediante su Id.
   * @param {Number} id Id del edificio en posesión.
   */
  getBuildingOwnedById(id) {
    return this.buildingsOwned.find((b) => b.id == id);
  }

  /**
   * Obtiene una mejora en posesión mediante su Id.
   * @param {Number} id Id de la mejora en posesión.
   */
  getUpgradeOwnedById(id) {
    return this.upgradesOwned.find((u) => u.id == id);
  }

  /**
   * Obtiene la lista de mejoras obtenidas filtradas por Id.
   * @param {Number} id Id de la mejora en posesión.
   */
  getUpgradeOwnedFilteredById(id) {
    return this.upgradesOwned.filter((u) => u.id == id);
  }

  /**
   * Obtiene una mejora disponible mediante su Id.
   * @param {Number} availableUpgrade Id de la mejora disponible.
   */
  getAvailableUpgradeById(availableUpgrade) {
    return this.availableUpgrades.find((u) => u == availableUpgrade);
  }

  /**
   * Obtiene el costo actualizado de un edificio.
   * @param {Building}  building  Edificio.
   * @param {Number}    quantity  Cantidad de dicho edificio.
   * @returns {Number} Costo de edificio.
   */
  getBuildingCostUpdated(building, quantity) {
    return Math.ceil(building.baseCost * Math.pow(this.#basePow, quantity));
  }

  /**
   * Obtiene el costo actualizado de una mejora.
   * @param {Upgrade} upgrade     Mejora.
   * @param {Number}  tierNumber  Nivel de la mejora.
   * @returns 
   */
  getTierCostUpdated(upgrade, tierNumber) {
    let tier = upgrade?.tiers.find((t) => t.number == tierNumber);
    if (tier) {
      tier.cost = Math.floor(upgrade.baseCost * Math.pow(this.#basePowUpgrades * ((tierNumber) * 2), tierNumber - 1));
    }

    return tier;
  }

  /**
   * Agrega un logro desbloqueado a la lista de logros.
   * @param {Number} id Id del logro.
   */
  addAchievmentUnlocked(id) {
    this.achievmentsUnlocked.push(id);
  }

  /**
   * Compra un edificio.
   * @param {Number}  id        Id del edificio a comprar.
   * @param {Number}  quantity  Cantidad de edificios a comprar.
   */
  buyBuilding(id, quantity) {
    let buildingOwned = this.getBuildingOwnedById(id);
    let buildingOwnedDOM = $(`#building-${id} > div.building-count-owned`);

    if (buildingOwned) {
      buildingOwned.quantity += quantity;
    } else {
      this.buildingsOwned.push({ id: id, quantity: quantity });
      buildingOwned = this.getBuildingOwnedById(id);
    }

    const building = GameBuildings.getBuildingById(id);
    GameLog.write(`${LanguageManager.getData().console.buyBuilding
      .replace('{b}', building.name)
      .replace('{g}', this.#prettyNumber(building.cost))}`);
    this.achievments.unlock(building.unlockAchievment);

    this.#substractCoins(building.cost);
    this.#rebuildBuildingBenefits();
    this.#updateBuildingCost(id, buildingOwned.quantity);
    this.#unlockNextBuilding(buildingOwned, -1);
    this.#unlockUpgrade(buildingOwned);

    buildingOwnedDOM.html(buildingOwned.quantity);
  }

  /**
   * Compra una mejora.
   * @param {Upgrade} upgrade Mejora a comprar.
   * @param {Tier}    tier    Nivel de la mejora a comprar.
   */
  buyUpgrarde(upgrade, tier) {
    let owned = $(`#upgrade-${upgrade.id}-${tier.number}`);

    const upgradeOwned = { id: upgrade.id, tier: tier.number, levelUp: tier.levelUp };
    this.upgradesOwned.push(upgradeOwned);

    if (this.upgradesOwned.length == 1) {
      this.achievments.unlock(3);
    }

    this.#substractCoins(tier.cost);
    this.#addUpgradeBenefits(upgradeOwned);

    const indexOf = this.availableUpgrades.findIndex((u) => u.id == upgrade.id && u.tier == tier.number);
    this.availableUpgrades.splice(indexOf, 1);
    this.#updateUpgradesTitle();

    const tierClass = GameUpgrades.getTierClass(tier.number);
    GameLog.write(`${LanguageManager.getData().console.buyUpgradeToBuilding
      .replace('{tc}', tierClass)
      .replace('{t}', GameUpgrades.getTierName(tier.number))
      .replace('{b}', upgrade.name)
      .replace('{g}', this.#prettyNumber(tier.cost))}`);

    let tierVarValue = window.getComputedStyle(document.documentElement).getPropertyValue(`--tier-${tierClass}`);
    document.getElementById(`building-${upgrade.id}`).style.setProperty("--blink-shadow", tierVarValue);

    const buildingButton = $(`#building-${upgrade.id}`);

    if (buildingButton.hasClass('blink')) {
      buildingButton.removeClass('blink');
      clearTimeout(this.#blinkTimeout);
    }

    buildingButton.addClass('blink');

    setInterval(() => {
      buildingButton.removeClass('blink');
    }, 7000);

    const previousLevelUp = this.upgradesOwned.find((u) => u.id == upgrade.id && u.tier == tier.number - 1)?.levelUp;
    if (previousLevelUp < tier.levelUp) {
      const building = GameBuildings.getBuildingById(upgrade.id);
      building.level = tier.levelUp;
      audioManager.play('levelup', 0.3);
      GameLog.write(`${LanguageManager.getData().console.buildingLevelUp
        .replace('{b}', upgrade.name)
        .replace('{l}', '⭐'.repeat(tier.levelUp))}`);
    }

    this.#rebuildBuildingBenefits();
    owned.remove();
  }

  /**
   * Prepara el tooltip para mostrar cuando el mouse se posiciona por encima de un edificio.
   * @param {Event}     e         Evento del mouse.
   * @param {Building}  building  Edificio. 
   */
  bindTooltipFunctionToBuildingButton(e, building) {
    const gameManager = this;

    let quantity = gameManager.getBuildingOwnedById(building.id)?.quantity ?? 0;
    let upgradesOwned = gameManager.getUpgradeOwnedFilteredById(building.id).sort((a, b) => a.tier - b.tier);

    let benefits = building.benefits.map((benefit) => {
      let auxBenefit = new Benefit(JSON.parse(JSON.stringify(benefit)));
      if (benefit.targetBuilding) {
        let targetBuilding = GameBuildings.getBuildingById(benefit.targetBuilding);
        let targetBuildingName = GameBuildings.getFormattedName(targetBuilding.name, 'gold', `${targetBuilding.icon}_${targetBuilding.level}`);
        auxBenefit.description = benefit.description.replace('{b}', targetBuildingName);
      }

      let aditional = benefit.aditional ?? '';
      return `<li>${auxBenefit.getFullDescription(quantity, this.getUnits())}</li>${aditional}`

    }).join("");

    let upgradeTiers = upgradesOwned.map((upgradeOwned) => {
      let tierVar = GameUpgrades.getTierClass(upgradeOwned.tier);
      let tierName = GameUpgrades.getTierNameFormatted(upgradeOwned.tier);
      let upgrade = GameUpgrades.getUpgradeById(upgradeOwned.id);
      let upgradeBenefits = GameUpgrades.getTierByUpgrade(upgrade, upgradeOwned.tier).benefits;
      let benefit;
      // if (upgradeBenefits.length == 1) {
      //   benefit = `<span style='margin-top: 5px;'>${upgradeBenefits[0].getFullDescription(quantity, this.getUnits())}</span>`;
      // } else {
      let border = upgradeOwned.tier == 15 ? 'border-image: var(--tier-outstanding) 1 15%; border-left: 3px ridge;' : `border-left: 3px ridge var(--tier-${tierVar})`;
      benefit = `<div style='padding: 5px 8px; margin-left: 10px; ${border};'>${upgradeBenefits.map((upgradeBenefit) => {
        return `<li>${upgradeBenefit.getFullDescription(quantity, this.getUnits())}</li>`
      }).join("")}</div>`;
      //}

      return `<div class='tier-upgrades'><span>${tierName} ${benefit}</span></div>`
    }).join("");

    let upgradesDescription = upgradesOwned.length > 0 ? `<span class='content-subtitle'>${LanguageManager.getData().store.upgradesTitle}:</span><br /><div style='overflow-y: overlay; max-height: 400px; margin-top: 5px'><ul>${upgradeTiers}</ul></div>` : '';

    Tooltip.setTooltip({
      event: e,
      title: building.name,
      subtitle: `${LanguageManager.getData().quantity}: ${quantity}`,
      description: `@separator@${building.description}<br /><br /><span class='content-subtitle'>${LanguageManager.getData().benefits.title
        }:</span><br /><ul>${benefits}</ul>${upgradesDescription}@separator@<span class='quote'>${building.quote}</span>`,
      icon: `img/buildings/${building.getIcon()}.png`,
      cost: building.cost,
      level: `${LanguageManager.getData().store.level}: ${'⭐'.repeat(building.level)}`,
      canBuy: gameManager.coins >= building.cost,
      position: "left",
      paddingLock: $(document).width() - $("#divider-buildings").position().left,
      gameUnits: this.getUnits(),
    });
  }

  /**
   * Prepara el tooltip para mostrar cuando el mouse se posiciona por encima de una mejora.
   * @param {Event}   e       Evento del mouse.
   * @param {Upgrade} upgrade Mejora.
   * @param {Tier}    tier    Nivel de la mejora.
   */
  bindTooltipFunctionToUpgradeButton(e, upgrade, tier) {
    const langData = LanguageManager.getData();
    const gameManager = this;
    const benefits = tier.benefits.map((benefit) => {
      let value = Benefit.getFormattedValue(this.#prettyNumber(benefit.getValue()), benefit.calculateAsPercent, 'benefit');
      let finalDescription = String(benefit.description).replace('{g}', value).replace(' ({t})', '');

      return finalDescription != '' ? `<li>${finalDescription}</li>` : ''
    }).join("");

    let unlockLevel = '';
    const showDescription = upgrade.description.trim() != '';
    const building = GameBuildings.getBuildingById(upgrade.id);

    if (building != null && tier.levelUp > building.level) {
      let buildingNameFormatted = langData.store.levelUp.replace("{b}", GameBuildings.getFormattedName(upgrade.name, 'gold', building.getIcon()));
      unlockLevel = `${buildingNameFormatted.replace('{l}', '⭐'.repeat(tier.levelUp))}<br /><br />`;
    }

    Tooltip.setTooltip({
      event: e,
      title: upgrade.name,
      subtitle: `<span>${langData.rarity}: ${GameUpgrades.getTierNameFormatted(tier.number)}</span>`,
      description: `@separator@${unlockLevel}${showDescription ? `${upgrade.description}<br /><br />` : `<span class='content-subtitle'>`}${langData.benefits.title
        }:</span><br /><ul>${benefits}</ul>@separator@<span class='quote'>${tier.quote}</span>`,
      icon: `img/buildings/${upgrade.icon}_${tier.levelUp}.png`,
      cost: tier.cost,
      canBuy: gameManager.coins >= tier.cost,
      position: "left",
      paddingLock: $(document).width() - $("#divider-buildings").position().left,
      gameUnits: this.getUnits(),
    });
  }

  /**
   * Obtiene las unidades numéricas.
   */
  getUnits() {
    return this.#units;
  }

  /**
   * Gets the general statistics about coins production.
   * @param {Event} e Mouse event.
   * @returns {Object} CoinsInfo object.
   */
  getGeneralStatistics(e) {
    const langData = LanguageManager.getData().coinsInfo;

    let initDate = new Date(this.initDate);
    let initDateString = `&nbsp;${initDate.toLocaleDateString()} ${initDate.toLocaleTimeString()} hs`;
    let notStartYet = `&nbsp;${langData.notStartYet}`;
    let subtitle = langData.subtitle.replace('{dt}', this.initDate ? `${initDateString}` : notStartYet);

    const coinsInfo = {
      event: e,
      title: langData.title,
      subtitle: subtitle,
      coins: langData.coins.replace('{g}', this.#prettyNumber(this.coins)),
      coinsGain: langData.coinsGain.replace('{g}', this.#prettyNumber(this.coinsGain)),
      coinsGainMultiplier: langData.coinsGainMultiplier.replace('{g}', this.#prettyNumber(this.coinsGainMultiplier)),
      coinsTotalPerSecond: langData.coinsTotalPerSecond.replace('{g}', this.#prettyNumber(this.coinsGain * this.coinsGainMultiplier)),
      coinsBonusPerQuest: langData.coinsBonusPerQuest.replace('{g}', this.#prettyNumber(this.coinsPerQuest + this.coinsBonusPerQuest)),
      coinsMultiplierPerQuest: langData.coinsMultiplierPerQuest.replace('{g}', this.#prettyNumber(this.coinsMultiplierPerQuest)),
      coinsTotalPerQuest: langData.coinsTotalPerQuest.replace('{g}', this.#prettyNumber((this.coinsPerQuest + this.coinsBonusPerQuest) * this.coinsMultiplierPerQuest)),
      coinsHistory: langData.coinsHistory.replace('{g}', this.#prettyNumber(this.coinsHistory)),
      clicksHistory: langData.clicksHistory.replace('{c}', this.#prettyNumber(this.clicksHistory)),
    }

    return coinsInfo;
  }

  /**
   * Draws divider lines with one line break before, and one after.
   * @returns {HTMLElement} Divider line.
   */
  drawDividerLines() {
    let line = "-".repeat(70);
    return `<span style='letter-spacing: 2px'><br />${line}<br /></span>`;
  }

  /**
 * Rotates a DOM element forever.
 */
  rotateForEver($elem, rotator) {
    const gameManager = this;
    if (rotator === void (0)) {
      rotator = $({ deg: 0 });
    } else {
      rotator.get(0).deg = 0;
    }

    return rotator.animate(
      { deg: 360 },
      {
        duration: 8000,
        easing: 'linear',
        step: function (now) {
          $elem.css({ transform: 'rotate(' + now + 'deg)' });
        },
        complete: function () {
          gameManager.rotateForEver($elem, rotator);
        },
      }
    );
  }

  /**
   * Redraws the upgrades in the Store.
   */
  redrawUpgrades() {
    this.availableUpgrades.sort((a, b) => a.isUnbuyable - b.isUnbuyable || a.cost - b.cost);
    for (let i = 0; i < this.availableUpgrades.length; i++) {
      const availableUpgrade = this.availableUpgrades[i];
      $("#store-wrap").find('#upgrades > div.container').append(availableUpgrade.element[0]);
    }
  }

  /**
   * Configura y prepara el juego para comenzar la partida. Independientemente si es una partida guardada o no.
   */
  #configure() {
    this.achievments.setLocalization();
    this.buildingsOwned.sort((a, b) => a.id - b.id);
    this.availableUpgrades.sort((a, b) => a.isUnbuyable - b.isUnbuyable || a.cost - b.cost);
    this.setHeroName(this.heroName);
    this.#addUnits();
    this.#welcomeBack();
    this.#setUpBuildings();
    this.#bindShiftKey();
  }


  /**
   * Bindea la tecla Shift al <body> para poder dejar fijos los tooltips de los edificios.
   */
  #bindShiftKey() {
    $('body').keydown(function (e) {
      Tooltip.setShiftPressed(e.shiftKey);
    }).keyup(function (e) {
      Tooltip.setShiftPressed(e.shiftKey);
    });
  }

  /**
   * Agrega las unidades numéricas a la lista de unidades.
   */
  #addUnits() {
    let units = LanguageManager.getData().formatUnit.units;
    let prefixes = LanguageManager.getData().formatUnit.prefixes;
    let suffixes = LanguageManager.getData().formatUnit.suffixes;

    this.#units.push.apply(this.#units, units);

    suffixes.forEach((s) => {
      prefixes.forEach((p) => {
        this.#units.push(` ${p + s}`);
      });
    });
  }

  /**
   * Resta cierta cantidad de monedas de oro a las actuales.
   * @param {Number} quantity Cantidad de monedas de oro a restar.
   */
  #substractCoins(quantity) {
    this.coins -= quantity;
    $("#coins").html(`${this.getCoinsFormatted(true)} <span>${LanguageManager.getData().coins}</span>`);
  }

  /**
   * Refresca en pantalla el costo del edificio en cuestión.
   * @param {Number} id       Id del edificio.
   * @param {Number} quantity Cantidad de edificios. 
   */
  #updateBuildingCost(id, quantity) {
    let building = GameBuildings.getBuildingById(id);
    building.cost = this.getBuildingCostUpdated(building, quantity);

    let cost = $(`#building-${id} > div.building-header > div.building-cost`);
    cost.html(this.#prettyNumber(building.cost));
  }

  /**
   * Agrega los beneficios de la mejora obtenida.
   * @param {Object} upgradeOwned Mejora obtenida.
   */
  #addUpgradeBenefits(upgradeOwned) {
    const upgrade = GameUpgrades.getUpgradeById(upgradeOwned.id);
    const tier = GameUpgrades.getTierByUpgrade(upgrade, upgradeOwned.tier);

    tier.benefits.forEach((benefit) => {
      const targetBuilding = GameBuildings.getBuildingById(benefit.targetBuilding);

      const hasCoinGains = targetBuilding.benefits.some((targetBenefit) => {
        return targetBenefit.coinsGain > 0 && targetBenefit.targetBuilding == null && benefit.coinsGain > 0;
      });
      const hasCoinsGainMultiplier = targetBuilding.benefits.some((targetBenefit) => {
        return targetBenefit.coinsGainMultiplier > 0 && targetBenefit.targetBuilding == null && benefit.coinsGainMultiplier > 0;
      });
      const hasCoinBonusPerQuest = targetBuilding.benefits.some((targetBenefit) => {
        return targetBenefit.coinsBonusPerQuest > 0 && targetBenefit.targetBuilding == null && benefit.coinsBonusPerQuest > 0;
      });
      const hasCoinsMultiplierPerQuest = targetBuilding.benefits.some((targetBenefit) => {
        return targetBenefit.coinsMultiplierPerQuest > 0 && targetBenefit.targetBuilding == null && benefit.coinsMultiplierPerQuest > 0;
      });

      if (hasCoinGains || hasCoinsGainMultiplier || hasCoinBonusPerQuest || hasCoinsMultiplierPerQuest) {
        targetBuilding.benefits.forEach((targetBenefit) => {
          if (targetBenefit.targetBuilding == null) {
            targetBenefit.coinsGain += hasCoinGains && targetBenefit.coinsGain > 0 ? benefit.coinsGain : 0;
            targetBenefit.coinsGainMultiplier += hasCoinsGainMultiplier && targetBenefit.coinsGainMultiplier > 0 ? benefit.coinsGainMultiplier : 0;
            targetBenefit.coinsBonusPerQuest += hasCoinBonusPerQuest && targetBenefit.coinsBonusPerQuest > 0 ? benefit.coinsBonusPerQuest : 0;
            targetBenefit.coinsMultiplierPerQuest += hasCoinsMultiplierPerQuest && targetBenefit.coinsMultiplierPerQuest > 0 ? benefit.coinsMultiplierPerQuest : 0;
          }
        });
      }
      else {
        const langData = LanguageManager.getData();
        let newDescription;

        if (benefit.coinsGain > 0)
          newDescription = langData.benefits.coinsGain.self;

        if (benefit.coinsGainMultiplier > 0)
          newDescription = langData.benefits.coinsGainMultiplier.self;

        if (benefit.coinsBonusPerQuest > 0)
          newDescription = langData.benefits.coinsBonusPerQuest.self;

        if (benefit.coinsMultiplierPerQuest > 0)
          newDescription = langData.benefits.coinsMultiplierPerQuest.self;

        const newBenefit = new Benefit({
          coinsGain: benefit.coinsGain,
          coinsGainMultiplier: benefit.coinsGainMultiplier,
          coinsBonusPerQuest: benefit.coinsBonusPerQuest,
          coinsMultiplierPerQuest: benefit.coinsMultiplierPerQuest,
          description: newDescription,
        });
        targetBuilding.benefits.push(newBenefit);
      }
    });
  }

  #rebuildBuildingBenefits() {
    let coins = {
      gain: 0,
      gainMultiplier: 0,
      bonusPerQuest: 0,
      multiplierPerQuest: 0,
    };

    for (let i = 0; i < this.buildingsOwned.length; i++) {
      let coinsBenefit = new Benefit({});

      const buildingOwned = this.buildingsOwned[i];
      GameBuildings.updateImage(buildingOwned.id);

      const building = GameBuildings.getBuildingById(buildingOwned.id);
      const filteredBuildingsByTargetBuilding = GameBuildings.filterByTargetBuilding(building.id);

      let arrayBenefits = [];
      filteredBuildingsByTargetBuilding.forEach((filteredBuilding) => {
        if (this.buildingsOwned.some((bo) => bo.id == filteredBuilding.id)) {

          filteredBuilding.benefits.forEach((filteredBenefit) => {

            if (filteredBenefit.targetBuilding == building.id) {
              const targetQuantity = this.buildingsOwned.find((b) => b.id == filteredBuilding.id).quantity;

              let actualFilteredBenefit = new Benefit({
                calculateAsPercent: filteredBenefit.calculateAsPercent,
                coinsGain: filteredBenefit.coinsGain * targetQuantity,
                coinsGainMultiplier: filteredBenefit.coinsGainMultiplier * targetQuantity,
                coinsBonusPerQuest: filteredBenefit.coinsBonusPerQuest * targetQuantity,
                coinsMultiplierPerQuest: filteredBenefit.coinsMultiplierPerQuest * targetQuantity,
              });

              arrayBenefits.push({ buildingName: filteredBuilding.name, benefit: actualFilteredBenefit, icon: filteredBuilding.getIcon() });

              coinsBenefit.calculateAsPercent = actualFilteredBenefit.calculateAsPercent;
              coinsBenefit.coinsGain = actualFilteredBenefit.coinsGain;
              coinsBenefit.coinsGainMultiplier = actualFilteredBenefit.coinsGainMultiplier;
              coinsBenefit.coinsBonusPerQuest = actualFilteredBenefit.coinsBonusPerQuest;
              coinsBenefit.coinsMultiplierPerQuest = actualFilteredBenefit.coinsMultiplierPerQuest;
            }
          });
        }
      });

      building.benefits.forEach((benefit) => {
        let totalGain = 0;
        let totalGainMultiplier = 0;
        let totalBonusPerQuest = 0;
        let totalMultiplierPerQuest = 0;

        if (benefit.targetBuilding == null) {
          let isSameBenefit =
            (coinsBenefit.coinsGain > 0 && benefit.coinsGain > 0) ||
            (coinsBenefit.coinsGainMultiplier > 0 && benefit.coinsGainMultiplier > 0) ||
            (coinsBenefit.coinsBonusPerQuest > 0 && benefit.coinsBonusPerQuest > 0) ||
            (coinsBenefit.coinsMultiplierPerQuest > 0 && benefit.coinsMultiplierPerQuest > 0);

          if (isSameBenefit) {
            if (coinsBenefit.calculateAsPercent) {
              totalGain = sumPercent((benefit.coinsGain * buildingOwned.quantity), coinsBenefit.coinsGain);
              totalGainMultiplier = sumPercent((benefit.coinsGainMultiplier * buildingOwned.quantity), coinsBenefit.coinsGainMultiplier);
              totalBonusPerQuest = sumPercent((benefit.coinsBonusPerQuest * buildingOwned.quantity), coinsBenefit.coinsBonusPerQuest);
              totalMultiplierPerQuest = sumPercent((benefit.coinsMultiplierPerQuest * buildingOwned.quantity), coinsBenefit.coinsMultiplierPerQuest);
            } else {
              totalGain = (benefit.coinsGain * buildingOwned.quantity) + coinsBenefit.coinsGain;
              totalGainMultiplier = (benefit.coinsGainMultiplier * buildingOwned.quantity) + coinsBenefit.coinsGainMultiplier;
              totalBonusPerQuest = (benefit.coinsBonusPerQuest * buildingOwned.quantity) + coinsBenefit.coinsBonusPerQuest;
              totalMultiplierPerQuest = (benefit.coinsMultiplierPerQuest * buildingOwned.quantity) + coinsBenefit.coinsMultiplierPerQuest;
            }
          } else {
            if (benefit.calculateAsPercent) {
              totalGain = sumPercent(benefit.coinsGain, (benefit.coinsGain * buildingOwned.quantity));
              totalGainMultiplier = sumPercent(1, (benefit.coinsGainMultiplier * buildingOwned.quantity));
              totalBonusPerQuest = sumPercent(benefit.coinsBonusPerQuest, (benefit.coinsBonusPerQuest * buildingOwned.quantity));
              totalMultiplierPerQuest = sumPercent(1, (benefit.coinsMultiplierPerQuest * buildingOwned.quantity));
            } else {
              totalGain = benefit.coinsGain * buildingOwned.quantity;
              totalGainMultiplier = benefit.coinsGainMultiplier * buildingOwned.quantity;
              totalBonusPerQuest = benefit.coinsBonusPerQuest * buildingOwned.quantity;
              totalMultiplierPerQuest = benefit.coinsMultiplierPerQuest * buildingOwned.quantity;
            }
          }

          coins.gain += totalGain;
          coins.gainMultiplier += totalGainMultiplier;
          coins.bonusPerQuest += totalBonusPerQuest;
          coins.multiplierPerQuest += totalMultiplierPerQuest;

          benefit.aditional = '';
          arrayBenefits.forEach((b) => {
            let value = b.benefit.getValue();
            let formattedValue = Benefit.getFormattedValue(this.#prettyNumber(value), b.benefit.calculateAsPercent, 'tier-frequent');
            let formattedBuilding = GameBuildings.getFormattedName(b.buildingName, 'gold', b.icon);

            let totalValue = 0;
            if (b.benefit.calculateAsPercent && benefit.calculateAsPercent) {
              totalValue = benefit.getValue() + value;
            } else if (b.benefit.calculateAsPercent) {
              totalValue = sumPercent(benefit.getValue(), value);
            } else {
              totalValue = benefit.getValue() + value;
            }
            let formattedTotalValue = Benefit.getFormattedValue(this.#prettyNumber(totalValue), benefit.calculateAsPercent, 'available');

            if ((benefit.coinsGain > 0 && b.benefit.coinsGain > 0) ||
              (benefit.coinsGainMultiplier > 0 && b.benefit.coinsGainMultiplier > 0) ||
              (benefit.coinsBonusPerQuest > 0 && b.benefit.coinsBonusPerQuest > 0) ||
              (benefit.coinsMultiplierPerQuest > 0 && b.benefit.coinsMultiplierPerQuest > 0)) {

              let aditional = LanguageManager.getData().benefits.beneficiedBy.replace('{b}', formattedBuilding).replace('{g}', formattedValue).replace('{t}', formattedTotalValue);
              benefit.aditional += `<li><ul><li>${aditional}</li></ul></li>`;
            }
          });
        }
      });
    }

    this.coinsGain = coins.gain;
    this.coinsGainMultiplier = coins.gainMultiplier == 0 ? 1 : roundNumber(coins.gainMultiplier);
    this.coinsBonusPerQuest = coins.bonusPerQuest;
    this.coinsMultiplierPerQuest = coins.multiplierPerQuest == 0 ? 1 : roundNumber(coins.multiplierPerQuest);
  }

  /**
   * Refresca en pantalla la cantidad de mejoras disponibles en la sección de "Mejoras", en la Tienda.
   */
  #updateUpgradesTitle() {
    let upgradesTitle = this.availableUpgrades.length > 0 ? `${LanguageManager.getData().store.upgradesTitle} (${this.availableUpgrades.length})` : LanguageManager.getData().store.upgradesTitle;
    $("#upgrades.store-section > div.title-section").html(upgradesTitle);

    if (this.availableUpgrades.length == 0)
      $(".container.upgrades").append(`<div class='upgrades-unavailable'>${LanguageManager.getData().store.unavailable}</div>`);
  }

  /**
   * Prepara todos los edificios para comenzar el juego.
   */
  #setUpBuildings() {
    this.#updateUpgradesTitle();
    $("#buildings.store-section > div.title-section").html(LanguageManager.getData().store.buildingsTitle);
    $("#store > .title.big > span").html(LanguageManager.getData().store.title);

    for (let i = 0; i < this.availableUpgrades.length; i++) {
      const availableUpgrade = this.availableUpgrades[i];
      let upgrade = GameUpgrades.getUpgradeById(availableUpgrade.id);
      let tier = this.getTierCostUpdated(upgrade, availableUpgrade.tier);

      if (tier) {
        GameUpgrades.unlockUpgrade({
          id: upgrade.id,
          canBuy: this.coins >= tier.cost,
          tier: tier.number,
          icon: `${upgrade.icon}_${tier.levelUp}`,
        });

        let owned = $(`#upgrade-${availableUpgrade.id}-${availableUpgrade.tier}`);
        availableUpgrade.element = owned;
      }
    }

    if (this.buildingsOwned.length == 0) {
      let startBuilding = GameBuildings.getBuildingById(1);
      GameBuildings.unlockBuilding({
        id: startBuilding.id,
        name: startBuilding.name,
        cost: startBuilding.cost.commafy(),
        canBuy: this.coins >= startBuilding.cost,
        icon: startBuilding.getIcon(),
      });
      GameBuildings.insertLockedBuilding();
    } else {
      for (let i = 1; i < this.buildingsOwned.length + 1; i++) {
        const buildingOwned = this.getBuildingOwnedById(i);
        this.#unlockNextBuilding(buildingOwned, i);
      }
    }

    this.upgradesOwned.forEach((upgrade) => {
      this.#addUpgradeBenefits(upgrade);
    });

    this.#rebuildBuildingBenefits();
  }

  /**
   * Desbloquea un nuevo edificio.
   * @param {Object}  previousBuildingOwned Edificio anterior en posesión.
   * @param {Number}  index                 Índice de la posición del edificio.
   */
  #unlockNextBuilding(previousBuildingOwned, index) {
    let nextId = previousBuildingOwned.id + 1;
    let isUnlockedPreviousBuilding = GameBuildings.isUnlocked(previousBuildingOwned.id);
    let isUnlockedNextBuilding = GameBuildings.isUnlocked(nextId);

    let nextBuilding = GameBuildings.getBuildingById(nextId);

    // Populate Previous Building
    if (!isUnlockedPreviousBuilding) {
      let building = GameBuildings.getBuildingById(previousBuildingOwned.id);
      building.cost = this.getBuildingCostUpdated(building, previousBuildingOwned.quantity);

      const buildingLevel = GameUpgrades.getMaxLevelByBuilding(building.id, this.upgradesOwned);
      building.level = buildingLevel;

      GameBuildings.unlockBuilding({
        id: building.id,
        name: building.name,
        cost: this.#prettyNumber(building.cost),
        countOwned: previousBuildingOwned.quantity,
        canBuy: this.coins >= building.cost,
        icon: building.getIcon(),
      });
    }

    // Populate Next Building
    if (index == -1 || index == this.buildingsOwned.length) {
      if (nextBuilding && !isUnlockedNextBuilding) {
        $("#building-locked").remove();

        if (isUnlockedPreviousBuilding && !isUnlockedNextBuilding) {
          GameLog.write(LanguageManager.getData().console.buildingUnlocked.replace('{b}', nextBuilding.name));
        }

        const buildingLevel = GameUpgrades.getMaxLevelByBuilding(nextBuilding.id, this.upgradesOwned);
        nextBuilding.level = buildingLevel;

        GameBuildings.unlockBuilding({
          id: nextBuilding.id,
          name: nextBuilding.name,
          cost: this.#prettyNumber(nextBuilding.cost),
          canBuy: this.coins >= nextBuilding.cost,
          icon: nextBuilding.getIcon(),
        });
        if (nextBuilding.id < GameBuildings.getCount()) GameBuildings.insertLockedBuilding();
      }
    }
  }

  /**
   * Desbloquea una mejora.
   * @param {Object} buildingOwned Edificio obtenido para desbloquear la mejora.
   */
  #unlockUpgrade(buildingOwned) {
    if (buildingOwned.quantity > 0) {
      $('.upgrades-unavailable').remove();

      let tierNumber;

      switch (buildingOwned.quantity) {
        case 1:
          tierNumber = 1;
          break;
        case 5:
          tierNumber = 2;
          break;
        case 25:
          tierNumber = 3;
          break;
        case 50:
          tierNumber = 4;
          break;
        case 100:
          tierNumber = 5;
          break;
        case 150:
          tierNumber = 6;
          break;
        case 200:
          tierNumber = 7;
          break;
        case 250:
          tierNumber = 8;
          break;
        case 300:
          tierNumber = 9;
          break;
        case 350:
          tierNumber = 10;
          break;
        case 400:
          tierNumber = 11;
          break;
        case 450:
          tierNumber = 12;
          break;
        case 500:
          tierNumber = 13;
          break;
        case 550:
          tierNumber = 14;
          break;
        case 600:
          tierNumber = 15;
          break;

        default:
          tierNumber = -1;
          break;
      }

      if (tierNumber != -1) {
        const upgrade = GameUpgrades.getUpgradeById(buildingOwned.id);
        const tier = this.getTierCostUpdated(upgrade, tierNumber);

        if (tier) {
          const availableUpgrade = { id: buildingOwned.id, tier: tierNumber, cost: tier.cost, icon: upgrade.icon };
          const isUnbuyable = GameUpgrades.isUnbuyable(availableUpgrade, this.upgradesOwned);
          const auxUpgrade = GameUpgrades.getUpgradeById(availableUpgrade.id);
          const tierLevel = GameUpgrades.getTierByUpgrade(auxUpgrade, availableUpgrade.tier).levelUp;
          availableUpgrade.isUnbuyable = isUnbuyable;

          GameUpgrades.unlockUpgrade({
            id: availableUpgrade.id,
            canBuy: isUnbuyable ^ this.coins >= availableUpgrade.cost,
            tier: availableUpgrade.tier,
            icon: `${availableUpgrade.icon}_${tierLevel}`,
          });

          let owned = $(`#upgrade-${availableUpgrade.id}-${availableUpgrade.tier}`);
          availableUpgrade.element = owned;

          this.availableUpgrades.push(availableUpgrade);
          this.redrawUpgrades();
        }
      }

      this.#updateUpgradesTitle();
    }
  }

  /**
   * Muestra cuántas monedas de oro se obtuvieron cuando el juego no estaba activo y, además, verifica logros.
   */
  #welcomeBack() {
    let coinsEarned = 0;
    if (this.getSaveDate() != null) {
      let timeElapsed = Math.floor((new Date().getTime() - this.config.saveDate) / 1000);
      console.log(`coinsGain: ${this.coinsGain}  coinsGainMultiplier: ${this.coinsGainMultiplier} timeElapsed: ${timeElapsed}`);
      coinsEarned = Math.ceil(this.coinsGain * this.coinsGainMultiplier * timeElapsed);

      if (coinsEarned) {
        this.coins += coinsEarned;
        const achievmentsIdle = this.achievments.searchByReachType('idle');
        achievmentsIdle.forEach((achievment) => {
          if (coinsEarned >= achievment.reachValue) {
            this.achievments.unlock(achievment.id);
          }
        });
        GameLog.write(String.format(LanguageManager.getData().welcomeBack, this.#prettyNumber(coinsEarned)));
      }
    }

    this.addCoins(this.coins, true);
  }

  /**
   * Inicia el loop del juego.
   */
  #initGameLoop() {
    this.gameLoop = new GameLoop();
    //this.gameLoop.showFPS();
  }

  /**
   * Establece los eventos básicos para el mouse en el juego.
   */
  #setEvents() {
    const gameManager = this;
    gameManager.rotateForEver($('#light'));

    $("#chest-button")
      .click(function (e) {
        $(this).removeClass("pressed");
        gameManager.openChest(e);
        Tooltip.hide();
        gameManager.setTooltipChest(false);
      })
      .mouseenter(function () {
        audioManager.play('mouse_hover', 1.8);
      })
      .mousedown(function () {
        $(this).addClass("pressed");
      })
      .mouseover(function () {
        $("#light").addClass("show");
        gameManager.setTooltipChest(true);
      })
      .mouseout(function () {
        $("#light").removeClass("show");
        Tooltip.hide();
      })
      .mousemove(function (e) {
        if (gameManager.getTooltipChest()) {
          Tooltip.setTooltip({
            event: e,
            title: LanguageManager.getData().chest.title,
            description: LanguageManager.getData().chest.description,
            icon: "img/treasure_chest_48.png",
            position: "bottom",
            gameUnits: gameManager.getUnits(),
          });
        }
      });

    $("#coins-per-sec").mouseenter(function () {
      gameManager.setCoinsGainDetailed(true);
      $(this).html(`base/s: ${Number.pretty(gameManager.coinsGain, gameManager.getUnits())} * m: ${Number.pretty(gameManager.coinsGainMultiplier, gameManager.getUnits())} = ${Number.pretty(gameManager.coinsGain * gameManager.coinsGainMultiplier, gameManager.getUnits())} /s`);
    }).mouseout(function () {
      gameManager.showCoinsPerSec();
      gameManager.setCoinsGainDetailed(false);
      Tooltip.hide();
    }).mousemove(function (e) {
      const coinsInfo = gameManager.getGeneralStatistics();

      Tooltip.setTooltip({
        event: e,
        title: coinsInfo.title,
        subtitle: coinsInfo.subtitle,
        description: `<span class='coins-info'>${coinsInfo.coins}${gameManager.drawDividerLines()}${coinsInfo.coinsGain}<br />${coinsInfo.coinsGainMultiplier}<br />${coinsInfo.coinsTotalPerSecond}${gameManager.drawDividerLines()}${coinsInfo.coinsBonusPerQuest}<br />${coinsInfo.coinsMultiplierPerQuest}<br />${coinsInfo.coinsTotalPerQuest}${gameManager.drawDividerLines()}${coinsInfo.coinsHistory}<br />${coinsInfo.clicksHistory}</span>`,
        icon: "img/stats.png",
        position: "bottom",
        width: 500,
        gameUnits: gameManager.getUnits(),
      });
      Tooltip.show();
    });

    $("#donjon-heroname").click(function () {
      let name = window.prompt(LanguageManager.getData().hero.prompt, gameManager.getHeroName());
      if (name != null) {
        if (name.length > 30) {
          alert(LanguageManager.getData().hero.tooLong);
        } else {
          gameManager.setHeroName(name);
        }
      }
    });
  }

  /**
   * Muestra de forma amigable los números grandes.
   * @param {Number} number Número a formatear.
   * @returns 
   */
  #prettyNumber(number) {
    return Number.pretty(number, this.getUnits());
  }
}

export default GameManager;