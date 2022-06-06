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
   * @param {String} heroName                 Nombre del jugador que aparecerá en pantalla.
   * @param {Number} coins                    Monedas de oro del momento.
   * @param {Number} coinsGain                Ganancia de monedas de oro por segundo.
   * @param {Number} coinsGainMultiplier      Multiplicador de ganancia de monedas de oro por segundo.
   * @param {Number} coinsPerQuest            Monedas de oro base por quest.
   * @param {Number} coinsBonusPerQuest       Ganancia de monedas de oro extra por quest.
   * @param {Number} coinsMultiplierPerQuest  Multiplicador de ganancia de monedas de oro por quest.
   * @param {Number} coinsHistory             Total de monedas de oro acumuladas desde que comenzó el juego.
   * @param {Number} buildingsOwned           Edificios obtenidos (comprados).
   * @param {Number} upgradesOwned            Mejoras obtenidas (compradas).
   * @param {Number} availableUpgrades        Mejoras disponibles para comprar.
   * @param {Number} config                   Configuración del juego.
   * @param {Number} achievments              Manejador de logros.
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
    buildingsOwned,
    upgradesOwned,
    availableUpgrades,
    config,
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
    this.buildingsOwned = buildingsOwned ?? [];
    this.upgradesOwned = upgradesOwned ?? [];
    this.availableUpgrades = availableUpgrades ?? [];
    this.config = new GameConfig(config);
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
    let coinsEarned = Math.round((this.coinsPerQuest + this.coinsBonusPerQuest) * this.coinsMultiplierPerQuest);

    if (this.coins == 0)
      this.achievments.unlock(1);

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
    }

    $("#coins").html(`${this.getCoinsFormatted(true)} <span>${LanguageManager.getData().coins}</span>`);
    if (!this.getCoinsGainDetailed())
      $("#coins.per-sec").html(`${this.#prettyNumber((this.coinsGain * this.coinsGainMultiplier))} /s`);
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

      building.level = GameUpgrades.getMaxLevelByBuilding(building.id, this.upgradesOwned);
      GameBuildings.updateImage(building.id);

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
    this.#rebuildBuildingBenefits();

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
    // this.#blinkTimeout = setTimeout(() => {
    //   buildingButton.removeClass('blink');
    // }, 7000);

    setInterval(() => {
      buildingButton.removeClass('blink');
    }, 7000);

    const previousLevelUp = this.upgradesOwned.find((u) => u.id == upgrade.id && u.tier == tier.number - 1)?.levelUp;
    if (previousLevelUp < tier.levelUp) {
      audioManager.play('levelup', 0.3);
      GameLog.write(`${LanguageManager.getData().console.buildingLevelUp
        .replace('{b}', upgrade.name)
        .replace('{l}', '⭐'.repeat(tier.levelUp))}`);
    }
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
      return `<li>${benefit.getFullDescription(quantity, this.getUnits())}</li>`
    }).join("");

    let upgradeTiers = upgradesOwned.map((upgradeOwned) => {
      let tierName = GameUpgrades.getTierNameFormatted(upgradeOwned.tier);
      let upgrade = GameUpgrades.getUpgradeById(upgradeOwned.id);
      let upgradeBenefits = GameUpgrades.getTierByUpgrade(upgrade, upgradeOwned.tier).benefits;
      let benefit;
      // if (upgradeBenefits.length == 1) {
      //   benefit = `<span style='margin-top: 5px;'>${upgradeBenefits[0].getFullDescription(quantity, this.getUnits())}</span>`;
      // } else {
      benefit = `<div style='margin-top: 5px; margin-left: 50px;'>${upgradeBenefits.map((upgradeBenefit) => { return `<li>${upgradeBenefit.getFullDescription(quantity, this.getUnits())}</li>` }).join("")}</div>`;
      //}

      return `<div class='tier-upgrades'><span>✔️ ${tierName} ${benefit}</span></div>`
    }).join("");

    let upgradesDescription = upgradesOwned.length > 0 ? `<b><u>${LanguageManager.getData().store.upgradesTitle}:</u></b><br /><div style='overflow-y: overlay; max-height: 400px;'><ul>${upgradeTiers}</ul></div>` : '';

    Tooltip.setTooltip({
      event: e,
      title: building.name,
      subtitle: `${LanguageManager.getData().quantity}: ${quantity}`,
      description: `@separator@${building.description}<br /><br /><b><u>${LanguageManager.getData().benefits.title
        }:</u></b><br /><ul>${benefits}</ul>${upgradesDescription}@separator@<span class='quote'>${building.quote}</span>`,
      icon: `/img/buildings/${building.icon}_${building.level}.png`,
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
      let value = benefit.getFormattedValue(this.#prettyNumber(benefit.getValue()), 'benefit');
      let finalDescription = String(benefit.description).replace('{g}', value).replace(' ({t})', '');

      return finalDescription != '' ? `<li>${finalDescription}</li>` : ''
    }).join("");

    let unlockLevel = '';
    const showDescription = upgrade.description.trim() != '';
    const building = GameBuildings.getBuildingById(upgrade.id);

    if (building != null && tier.levelUp > building.level) {
      let buildingNameFormatted = langData.store.levelUp.replace("{b}", GameBuildings.getFormattedName(upgrade.name, 'gold'));
      unlockLevel = `${buildingNameFormatted.replace('{l}', '⭐'.repeat(tier.levelUp))}<br /><br />`;
    }

    Tooltip.setTooltip({
      event: e,
      title: upgrade.name,
      subtitle: `<span>${langData.rarity}: ${GameUpgrades.getTierNameFormatted(tier.number)}</span>`,
      description: `@separator@${unlockLevel}${showDescription ? `${upgrade.description}<br /><br />` : '<b><u>'}${langData.benefits.title
        }:</u></b><br /><ul>${benefits}</ul>@separator@<span class='quote'>${tier.quote}</span>`,
      icon: `/img/buildings/${upgrade.icon}_${tier.levelUp}.png`,
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

  /**
   * Recalcula los beneficios de todos los edificios.
   */
  #rebuildBuildingBenefits() {
    let addedBuildings = [];
    let coins = {
      gain: 0,
      gainMultiplier: 0,
      bonusPerQuest: 0,
      multiplierPerQuest: 0,
    };

    for (let i = 0; i < this.buildingsOwned.length; i++) {
      const buildingOwned = this.buildingsOwned[i];
      GameBuildings.updateImage(buildingOwned.id);

      if (addedBuildings.indexOf(buildingOwned.id) > -1) continue;

      const building = GameBuildings.getBuildingById(buildingOwned.id);
      const filteredBuildingsByTargetBuilding = GameBuildings.filterByTargetBuilding(building.id);

      console.log(`-> Edificio: ${building.name}`);
      console.log(`   |__ Beneficios:`);
      building.benefits.forEach((benefit) => {
        let processedBenefit = false;
        console.log(`       |__ ${benefit.description}`);

        if (benefit.targetBuilding == null) {
          filteredBuildingsByTargetBuilding.forEach((filteredBuilding) => {
            if (this.buildingsOwned.some((bo) => bo.id == filteredBuilding.id)) {

              filteredBuilding.benefits.forEach((filteredBenefit) => {

                if (filteredBenefit.targetBuilding == building.id) {
                  const targetQuantity = this.buildingsOwned.find((b) => b.id == filteredBuilding.id).quantity;
                  const calculatedBenefit = this.#calculateSameBenefit
                    ({
                      benefit: benefit,
                      targetBenefit: filteredBenefit,
                      buildingQuantity: buildingOwned.quantity,
                      targetBuildingQuantity: targetQuantity
                    });

                  coins.gain += calculatedBenefit.gain;
                  coins.gainMultiplier += calculatedBenefit.gainMultiplier;
                  coins.bonusPerQuest += calculatedBenefit.bonusPerQuest;
                  coins.multiplierPerQuest += calculatedBenefit.multiplierPerQuest;

                  processedBenefit = true;

                  if (calculatedBenefit.gain > 0 ||
                    calculatedBenefit.gainMultiplier > 1 ||
                    calculatedBenefit.bonusPerQuest > 0 ||
                    calculatedBenefit.multiplierPerQuest > 1) {
                    console.log(`           |__ Mejorado por: ${filteredBuilding.name}`);
                  }
                }
              });
            }
          });

          if (!processedBenefit) {
            const calculatedBenefit = this.#calculateBasicBenefit(benefit, buildingOwned.quantity);

            coins.gain += calculatedBenefit.gain;
            coins.gainMultiplier += calculatedBenefit.gainMultiplier;
            coins.bonusPerQuest += calculatedBenefit.bonusPerQuest;
            coins.multiplierPerQuest += calculatedBenefit.multiplierPerQuest;
          }
        }
      });

      // building.benefits.forEach((benefit) => {
      //   if (benefit.targetBuilding) {
      //     const targetBuilding = GameBuildings.getBuildingById(benefit.targetBuilding);
      //     const targetQuantity = this.buildingsOwned.find((b) => b.id == targetBuilding.id).quantity;

      //     targetBuilding.benefits.forEach((targetBenefit) => {
      //       const calculatedBenefit = this.#calculateBenefit({ benefit: benefit, targetBenefit: targetBenefit, buildingQuantity: buildingOwned.quantity, targetBuildingQuantity: targetQuantity });

      //       coins.gain += calculatedBenefit.gain;
      //       coins.gainMultiplier += calculatedBenefit.gainMultiplier;
      //       coins.bonusPerQuest += calculatedBenefit.bonusPerQuest;
      //       coins.multiplierPerQuest += calculatedBenefit.multiplierPerQuest;
      //     });

      //     addedBuildings.push(benefit.targetBuilding);
      //   } else {
      //     const calculatedBenefit = this.#calculateBenefit({ benefit: benefit, buildingQuantity: buildingOwned.quantity });

      //     coins.gain += calculatedBenefit.gain;
      //     coins.gainMultiplier += calculatedBenefit.gainMultiplier;
      //     coins.bonusPerQuest += calculatedBenefit.bonusPerQuest;
      //     coins.multiplierPerQuest += calculatedBenefit.multiplierPerQuest;
      //   }
      // });

      addedBuildings.push(building.id);
    }

    this.coinsGain = coins.gain;
    this.coinsGainMultiplier = coins.gainMultiplier == 0 ? 1 : roundNumber(coins.gainMultiplier);
    this.coinsBonusPerQuest = coins.bonusPerQuest;
    this.coinsMultiplierPerQuest = coins.multiplierPerQuest == 0 ? 1 : roundNumber(coins.multiplierPerQuest);
  }

  /**
   * Realiza los cálculos correspondientes para obtener los modificadores finales de un beneficio,
   * o un beneficio objetivo en todas sus posibilidades.
   * @param {Benefit} benefit                 Beneficio actual.
   * @param {Benefit} targetBenefit           Beneficio objetivo.
   * @param {Number}  buildingQuantity        Cantidad de edificios del actual beneficio.
   * @param {Number}  targetBuildingQuantity  Cantidad de edificios del beneficio objetivo.
   * @returns {Object} Objeto que incluye los modificadores (de monedas de oro) principales del juego.
   */
  #calculateBenefit({ benefit, targetBenefit, buildingQuantity, targetBuildingQuantity }) {
    let coins = {
      gain: 0,
      gainMultiplier: 1,
      bonusPerQuest: 0,
      multiplierPerQuest: 1,
    };

    if (targetBenefit && targetBuildingQuantity) {
      let isSameBenefit =
        (targetBenefit.coinsGain > 0 && benefit.coinsGain > 0) ||
        (targetBenefit.coinsGainMultiplier > 0 && benefit.coinsGainMultiplier > 0) ||
        (targetBenefit.coinsBonusPerQuest > 0 && benefit.coinsBonusPerQuest > 0) ||
        (targetBenefit.coinsMultiplierPerQuest > 0 && benefit.coinsMultiplierPerQuest > 0);

      if (isSameBenefit) {
        coins = this.#calculateComplexBenefit(benefit, targetBenefit, buildingQuantity, targetBuildingQuantity);
      } else {
        coins = this.#calculateBasicBenefit(targetBenefit, targetBuildingQuantity);
      }
    } else {
      coins = this.#calculateBasicBenefit(benefit, buildingQuantity);
    }

    return coins;
  }

  /**
   * Realiza los cálculos correspondientes para obtener los modificadores finales de un beneficio,
   * o un beneficio objetivo en todas sus posibilidades.
   * @param {Benefit} benefit                 Beneficio actual.
   * @param {Benefit} targetBenefit           Beneficio objetivo.
   * @param {Number}  buildingQuantity        Cantidad de edificios del actual beneficio.
   * @param {Number}  targetBuildingQuantity  Cantidad de edificios del beneficio objetivo.
   * @returns {Object} Objeto que incluye los modificadores (de monedas de oro) principales del juego.
   */
  #calculateSameBenefit({ benefit, targetBenefit, buildingQuantity, targetBuildingQuantity }) {
    let coins = {
      gain: 0,
      gainMultiplier: 1,
      bonusPerQuest: 0,
      multiplierPerQuest: 1,
    };

    if (targetBenefit && targetBuildingQuantity) {
      let isSameBenefit =
        (targetBenefit.coinsGain > 0 && benefit.coinsGain > 0) ||
        (targetBenefit.coinsGainMultiplier > 0 && benefit.coinsGainMultiplier > 0) ||
        (targetBenefit.coinsBonusPerQuest > 0 && benefit.coinsBonusPerQuest > 0) ||
        (targetBenefit.coinsMultiplierPerQuest > 0 && benefit.coinsMultiplierPerQuest > 0);

      if (isSameBenefit) {
        coins = this.#calculateComplexBenefit(benefit, targetBenefit, buildingQuantity, targetBuildingQuantity);
      }
    }

    return coins;
  }

  /**
   * Realiza los cálculos correspondientes para obtener los modificadores finales de un beneficio.
   * @param {Benefit} benefit           Beneficio.
   * @param {Number}  buildingQuantity  Cantidad de edificios del beneficio actual.
   * @returns {Object} Objeto que incluye los modificadores (de monedas de oro) principales del juego.
   */
  #calculateBasicBenefit(benefit, buildingQuantity) {
    let coins = {
      gain: 0,
      gainMultiplier: 1,
      bonusPerQuest: 0,
      multiplierPerQuest: 1,
    };

    if (benefit.calculateAsPercent) {
      coins.gain = sumPercent(benefit.coinsGain, (benefit.coinsGain * buildingQuantity));
      coins.gainMultiplier = sumPercent(coins.gainMultiplier, (benefit.coinsGainMultiplier * buildingQuantity));
      coins.bonusPerQuest = sumPercent(benefit.coinsBonusPerQuest, (benefit.coinsBonusPerQuest * buildingQuantity));
      coins.multiplierPerQuest = sumPercent(coins.multiplierPerQuest, (benefit.coinsMultiplierPerQuest * buildingQuantity));
    } else {
      coins.gain = benefit.coinsGain * buildingQuantity;
      coins.gainMultiplier = benefit.coinsGainMultiplier * buildingQuantity;
      coins.bonusPerQuest = benefit.coinsBonusPerQuest * buildingQuantity;
      coins.multiplierPerQuest = benefit.coinsMultiplierPerQuest * buildingQuantity;
    }

    return coins;
  }

  /**
   * Realiza los cálculos correspondientes para obtener los modificadores finales de un beneficio cruzado con un beneficio objetivo.
   * @param {Benefit} benefit                 Beneficio actual.
   * @param {Benefit} targetBenefit           Beneficio objetivo.
   * @param {Number}  buildingQuantity        Cantidad de edificios del actual beneficio.
   * @param {Number}  targetBuildingQuantity  Cantidad de edificios del beneficio objetivo.
   * @returns {Object} Objeto que incluye los modificadores (de monedas de oro) principales del juego.
   */
  #calculateComplexBenefit(benefit, targetBenefit, buildingQuantity, targetBuildingQuantity) {
    let coins = {
      gain: 0,
      gainMultiplier: 1,
      bonusPerQuest: 0,
      multiplierPerQuest: 1,
    };

    if (benefit.calculateAsPercent) {
      coins.gain = sumPercent(targetBenefit.coinsGain, (benefit.coinsGain * buildingQuantity)) * targetBuildingQuantity;
      coins.gainMultiplier = sumPercent(targetBenefit.coinsGainMultiplier, (benefit.coinsGainMultiplier * buildingQuantity)) * targetBuildingQuantity;
      coins.bonusPerQuest = sumPercent(targetBenefit.coinsBonusPerQuest, (benefit.coinsBonusPerQuest * buildingQuantity)) * targetBuildingQuantity;
      coins.multiplierPerQuest = sumPercent(targetBenefit.coinsMultiplierPerQuest, (benefit.coinsMultiplierPerQuest * buildingQuantity)) * targetBuildingQuantity;
    } else {
      coins.gain = ((benefit.coinsGain * buildingQuantity) + targetBenefit.coinsGain) * targetBuildingQuantity;
      coins.gainMultiplier = ((benefit.coinsGainMultiplier * buildingQuantity) + targetBenefit.coinsGainMultiplier) * targetBuildingQuantity;
      coins.bonusPerQuest = ((benefit.coinsBonusPerQuest * buildingQuantity) + targetBenefit.coinsBonusPerQuest) * targetBuildingQuantity;
      coins.multiplierPerQuest = ((benefit.coinsMultiplierPerQuest * buildingQuantity) + targetBenefit.coinsMultiplierPerQuest) * targetBuildingQuantity;
    }

    return coins;
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
        icon: `${startBuilding.icon}_${startBuilding.level}`,
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

      GameBuildings.unlockBuilding({
        id: building.id,
        name: building.name,
        cost: this.#prettyNumber(building.cost),
        countOwned: previousBuildingOwned.quantity,
        canBuy: this.coins >= building.cost,
        icon: `${building.icon}_${buildingLevel}`,
      });
    }

    // Populate Next Building
    if (index == -1 || index == this.buildingsOwned.length) {
      if (nextBuilding && !isUnlockedNextBuilding) {
        $("#building-locked").remove();

        if (isUnlockedPreviousBuilding && !isUnlockedNextBuilding)
          GameLog.write(LanguageManager.getData().console.buildingUnlocked.replace('{b}', nextBuilding.name));
        GameBuildings.unlockBuilding({
          id: nextBuilding.id,
          name: nextBuilding.name,
          cost: this.#prettyNumber(nextBuilding.cost),
          canBuy: this.coins >= nextBuilding.cost,
          icon: `${nextBuilding.icon}_${nextBuilding.level}`,
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

  redrawUpgrades() {
    this.availableUpgrades.sort((a, b) => a.isUnbuyable - b.isUnbuyable || a.cost - b.cost);
    for (let i = 0; i < this.availableUpgrades.length; i++) {
      const availableUpgrade = this.availableUpgrades[i];
      $("#store-wrap").find('#upgrades > div.container').append(availableUpgrade.element[0]);
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
    this.gameLoop.showFPS();
  }

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
            id: "chest",
            event: e,
            title: LanguageManager.getData().chest.title,
            description: LanguageManager.getData().chest.description,
            icon: "/img/treasure_chest.png",
            position: "bottom",
            gameUnits: gameManager.getUnits(),
          });
        }
      });

    $("#coins.per-sec").mouseenter(function () {
      gameManager.setCoinsGainDetailed(true);
      $(this).html(`base/s: ${Number.pretty(gameManager.coinsGain, gameManager.getUnits())} * m: ${gameManager.coinsGainMultiplier} = ${Number.pretty(gameManager.coinsGain * gameManager.coinsGainMultiplier, gameManager.getUnits())} /s`);
    }).mouseout(function () {
      gameManager.setCoinsGainDetailed(false);
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