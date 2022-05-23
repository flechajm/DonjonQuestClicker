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

class GameManager {
  #basePow;
  #basePowUpgrades;
  #units;
  #showTooltipChest;

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
    this.#basePowUpgrades = 10;
    this.#units = [];
    this.#showTooltipChest = true;
  }

  async loadConfig() {
    await LanguageManager.setLanguage(this.config.lang);
  }

  start() {
    const gameManager = this;
    this.#intiGameLoop();
    this.#setEvents();
    this.#configure();

    setInterval(function () {
      gameManager.updateTitle();
    }, 1000);

    this.gameLoop.gameLoop();
    this.gameLoop.saveLoop();
  }

  setSaveDate(date) {
    this.config.saveDate = date;
  }

  getSaveDate() {
    return this.config.saveDate;
  }

  setTooltipChest(show) {
    this.#showTooltipChest = show;
  }

  getTooltipChest() {
    return this.#showTooltipChest;
  }

  getSuffixHeroName() {
    return LanguageManager.getData().hero.class;
  }

  openChest(e) {
    let coinsEarned = Math.round((this.coinsPerQuest + this.coinsBonusPerQuest) * this.coinsMultiplierPerQuest);

    if (this.coins == 0)
      this.achievments.unlock(1);

    GameEffects.spawnCoinsEarned(e, this.#prettyNumber(coinsEarned));
    GameEffects.spawnIconCoin(e);

    this.addCoins(coinsEarned);
  }

  addCoins(quantity, isLoading) {
    if (!isLoading) {
      this.coins += quantity;
      this.coinsHistory += quantity;
    }

    $("#coins").html(`${this.getCoinsFormatted(true)} <span>${LanguageManager.getData().coins}</span>`);
    //$("#coins.per-sec").html(`(+${this.#prettyNumber((this.coinsGain * this.coinsGainMultiplier))}/s)`);
    $("#coins.per-sec").html(`(+${this.#prettyNumber((this.coinsGain * this.coinsGainMultiplier))}/s) m: ${this.#prettyNumber(this.coinsGainMultiplier)}`);
  }

  getCoinsFormatted(returnPrettyNumber) {
    return returnPrettyNumber ? this.#prettyNumber(this.coins) : String(this.coins).commafy();
  }

  setHeroName(name) {
    this.heroName = name;
    $("#donjon-heroname p").html(this.heroName + this.getSuffixHeroName());
  }

  getHeroName() {
    return this.heroName;
  }

  updateTitle() {
    if (this.coins > 0) {
      let preposition = this.config.lang == "es" ? "de" : "";
      document.title = `${this.getCoinsFormatted(true)} ${preposition} ${LanguageManager.getData().coins} - ${GameInfo.title
        }`;
    }
  }

  getBasePow() {
    return this.#basePow;
  }

  checkBuildingsAvailable() {
    const gameManager = this;
    let buildingsCount = GameBuildings.getCount() + 1;

    for (let i = 1; i < buildingsCount; i++) {
      const building = GameBuildings.getBuildingById(i);
      const button = $(`#building-${building.id}`);

      if (!button) return;

      if (building.cost > gameManager.coins) {
        button.addClass("disabled");
        button.unbind("click");
      } else {
        Tooltip.updateCost(gameManager.coins);
        button.removeClass("disabled");
        button.unbind("click").click(function (e) {
          gameManager.buyBuilding(building.id, 1);
          gameManager.bindTooltipFunctionToBuildingButton(e, building);
          gameManager.checkBuildingsAvailable();
        });
      }

      button
        .unbind("mousemove")
        .mousemove(function (e) {
          gameManager.bindTooltipFunctionToBuildingButton(e, building);
        })
        .mouseout(function () {
          Tooltip.hide();
        });
    }
  }

  checkUpgradesAvailable() {
    const gameManager = this;

    for (let i = 0; i < this.availableUpgrades.length; i++) {
      const availableUpgrade = this.getAvailableUpgradeById(this.availableUpgrades[i]);
      if (!availableUpgrade) return;

      const upgrade = GameUpgrades.getUpgradeById(availableUpgrade.id);
      const tier = this.getTierUpgradeUpdated(upgrade, availableUpgrade.tier);
      if (!tier) return;

      const button = $(`#upgrade-${availableUpgrade.id}-${availableUpgrade.tier}`);
      if (!button) return;

      if (tier.cost > gameManager.coins) {
        button.addClass("disabled-tara");
        button.unbind("click");
      } else {
        Tooltip.updateCost(gameManager.coins);
        button.removeClass("disabled-tara");
        button.unbind("click").click(function (e) {
          gameManager.buyUpgrarde(upgrade, tier);
          gameManager.bindTooltipFunctionToUpgradeButton(e, upgrade, tier);
          gameManager.checkUpgradesAvailable();
        });
      }

      button.unbind("mouseover mousemove")
        .on('mouseover mousemove', function (e) {
          gameManager.bindTooltipFunctionToUpgradeButton(e, upgrade, tier);
        }).unbind("mouseout")
        .mouseout(function () {
          Tooltip.hide();
        });
    }
  }

  getBuildingOwnedById(id) {
    return this.buildingsOwned.find((b) => b.id == id);
  }

  getUpgradeOwnedById(id) {
    return this.upgradesOwned.find((u) => u.id == id);
  }

  getUpgradeOwnedFilteredById(id) {
    return this.upgradesOwned.filter((u) => u.id == id);
  }

  getAvailableUpgradeById(availableUpgrade) {
    return this.availableUpgrades.find((u) => u == availableUpgrade);
  }

  getBuildingCostUpdated(building, quantity) {
    return Math.ceil(building.baseCost * Math.pow(this.#basePow, quantity));
  }

  getTierUpgradeUpdated(upgrade, tierNumber) {
    let tier = upgrade?.tiers.find((t) => t.number == tierNumber);
    if (tier) {
      tier.cost = tier.number == 1 ? upgrade.baseCost : Math.floor(upgrade.baseCost * Math.pow(this.#basePowUpgrades * ((tierNumber - 1) / 2), tierNumber - 1));
    }

    return tier;
  }

  addAchievmentUnlocked(id) {
    this.achievmentsUnlocked.push(id);
  }

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

    this.#substractCoins(building.cost);
    this.#addBuildingBenefits();
    this.#updateBuildingCost(id, buildingOwned.quantity);
    this.#unlockNextBuilding(buildingOwned, -1);
    this.#unlockUpgrade(buildingOwned, id);

    this.achievments.unlock(building.unlockAchievment);

    buildingOwnedDOM.html(buildingOwned.quantity);
  }

  buyUpgrarde(upgrade, tier) {
    let owned = $(`#upgrade-${upgrade.id}-${tier.number}`);

    const upgradeOwned = { id: upgrade.id, tier: tier.number };
    this.upgradesOwned.push(upgradeOwned);

    this.#substractCoins(tier.cost);
    this.#addUpgradeBenefits(upgradeOwned);
    this.#addBuildingBenefits();

    const indexOf = this.availableUpgrades.findIndex((u) => u.id == upgrade.id && u.tier == tier.number);
    this.availableUpgrades.splice(indexOf, 1);
    this.#updateUpgradesTitle();

    owned.remove();
  }

  bindTooltipFunctionToBuildingButton(e, building) {
    const gameManager = this;

    let quantity = gameManager.getBuildingOwnedById(building.id)?.quantity ?? 0;
    let upgradesOwned = gameManager.getUpgradeOwnedFilteredById(building.id).sort((a, b) => a.tier - b.tier);

    let benefits = building.benefits.map((benefit) => {
      let value = benefit.getFormattedValue(this.#prettyNumber(benefit.getValue()), 'benefit');
      let totalValue = benefit.getFormattedValue(this.#prettyNumber(roundNumber(benefit.getValue() * quantity)), "available");
      let finalDescription = String(benefit.description).replace('{g}', value).replace('{t}', totalValue);

      return `<li>${finalDescription}</li>`
    }).join("");

    let upgradeTiers = upgradesOwned.map((upgradeOwned) => {
      let tierName = GameUpgrades.getTierName(upgradeOwned.tier);
      let upgrade = GameUpgrades.getUpgradeById(upgradeOwned.id);
      let upgradeBenefits = GameUpgrades.getTierByUpgrade(upgrade, upgradeOwned.tier).benefits;
      let benefit = `<span style='margin-top: 5px;'>${String(upgradeBenefits[0].description)}</span>`;

      return `<div class='tier-upgrades'><span>✔️ ${tierName} ${benefit}</span></div>`
    }).join("");

    let upgradesDescription = upgradesOwned.length > 0 ? `<b><u>${LanguageManager.getData().store.upgradesTitle}:</u></b><br /><ul>${upgradeTiers}</ul>` : '';

    Tooltip.setTooltip({
      event: e,
      title: building.name,
      subtitle: `${LanguageManager.getData().quantity}: ${quantity}`,
      description: `@separator@${building.description}<br /><br /><b><u>${LanguageManager.getData().benefits.title
        }:</u></b><br /><ul>${benefits}</ul>${upgradesDescription}@separator@<span class='quote'>${building.quote}</span>`,
      icon: `/img/buildings/${building.icon}.png`,
      cost: building.cost,
      canBuy: gameManager.coins >= building.cost,
      position: "left",
      paddingLock: $(document).width() - $("#divider-buildings").position().left,
      gameUnits: this.getUnits(),
    });
  }

  bindTooltipFunctionToUpgradeButton(e, upgrade, tier) {
    const gameManager = this;
    const benefits = tier.benefits.map((benefit) => {
      return `<li>${benefit.description}</li>`
    }).join("");

    Tooltip.setTooltip({
      event: e,
      title: upgrade.name,
      subtitle: `<span>${LanguageManager.getData().rarity}: ${GameUpgrades.getTierName(tier.number)}</span>`,
      description: `@separator@${upgrade.description}<br /><br /><b><u>${LanguageManager.getData().benefits.title
        }:</u></b><br /><ul>${benefits}</ul>`,
      icon: `/img/buildings/${upgrade.icon}.png`,
      cost: tier.cost,
      canBuy: gameManager.coins >= tier.cost,
      position: "left",
      paddingLock: $(document).width() - $("#divider-buildings").position().left,
      gameUnits: this.getUnits(),
    });
  }

  getUnits() {
    return this.#units;
  }

  #configure() {
    this.achievments.setLocalization();
    this.buildingsOwned.sort((a, b) => a.id - b.id);
    this.availableUpgrades.sort((a, b) => a.cost - b.cost);
    this.setHeroName(this.heroName);
    this.#addUnits();
    this.#welcomeBack();
    this.#setUpBuildings();
  }

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

  #substractCoins(quantity) {
    this.coins -= quantity;
    $("#coins").html(`${this.getCoinsFormatted(true)} <span>${LanguageManager.getData().coins}</span>`);
  }

  #updateBuildingCost(id, quantity) {
    let building = GameBuildings.getBuildingById(id);
    building.cost = this.getBuildingCostUpdated(building, quantity);

    let cost = $(`#building-${id} > div.building-header > div.building-cost`);
    cost.html(this.#prettyNumber(building.cost));
  }

  #addUpgradeBenefits(upgradeOwned) {
    const upgrade = GameUpgrades.getUpgradeById(upgradeOwned.id);
    const tier = GameUpgrades.getTierByUpgrade(upgrade, upgradeOwned.tier);

    tier.benefits.forEach((benefit) => {
      const targetBuilding = GameBuildings.getBuildingById(benefit.targetBuilding);
      targetBuilding.benefits.forEach((targetBenefit) => {
        targetBenefit.coinsGain += benefit.coinsGain;
        targetBenefit.coinsGainMultiplier += benefit.coinsGainMultiplier;
        targetBenefit.coinsBonusPerQuest += benefit.coinsBonusPerQuest;
        targetBenefit.coinsMultiplierPerQuest += benefit.coinsMultiplierPerQuest;
      });
    });
  }

  #addBuildingBenefits() {
    const reverseBuildings = this.buildingsOwned.sort((a, b) => b.id - a.id);
    let addedBuildings = [];
    let coins = {
      gain: 0,
      gainMultiplier: 0,
      bonusPerQuest: 0,
      multiplierPerQuest: 0,
    };

    for (let i = 0; i < reverseBuildings.length; i++) {
      const buildingOwned = this.buildingsOwned[i];
      if (addedBuildings.indexOf(buildingOwned.id) > -1) continue;

      const building = GameBuildings.getBuildingById(buildingOwned.id);
      building.benefits.forEach((benefit) => {
        if (benefit.targetBuilding) {
          const targetBuilding = GameBuildings.getBuildingById(benefit.targetBuilding);
          const targetQuantity = this.buildingsOwned.find((b) => b.id == targetBuilding.id).quantity;

          targetBuilding.benefits.forEach((targetBenefit) => {
            const calculatedBenefit = this.#calculateBenefit({ benefit: benefit, targetBenefit: targetBenefit, buildingQuantity: buildingOwned.quantity, targetBuildingQuantity: targetQuantity });

            coins.gain += calculatedBenefit.gain;
            coins.gainMultiplier += calculatedBenefit.gainMultiplier;
            coins.bonusPerQuest += calculatedBenefit.bonusPerQuest;
            coins.multiplierPerQuest += calculatedBenefit.multiplierPerQuest;
          });

          addedBuildings.push(benefit.targetBuilding);
        } else {
          const calculatedBenefit = this.#calculateBenefit({ benefit: benefit, buildingQuantity: buildingOwned.quantity });

          coins.gain += calculatedBenefit.gain;
          coins.gainMultiplier += calculatedBenefit.gainMultiplier;
          coins.bonusPerQuest += calculatedBenefit.bonusPerQuest;
          coins.multiplierPerQuest += calculatedBenefit.multiplierPerQuest;
        }
      });

      addedBuildings.push(building.id);
    }

    this.coinsGain = coins.gain;
    this.coinsGainMultiplier = coins.gainMultiplier == 0 ? 1 : roundNumber(coins.gainMultiplier);
    this.coinsBonusPerQuest = coins.bonusPerQuest;
    this.coinsMultiplierPerQuest = coins.multiplierPerQuest == 0 ? 1 : roundNumber(coins.multiplierPerQuest);
  }

  #calculateBenefit({ benefit, targetBenefit, buildingQuantity, targetBuildingQuantity }) {
    let coins = {
      gain: 0,
      gainMultiplier: 1,
      bonusPerQuest: 0,
      multiplierPerQuest: 1,
    };

    if (targetBenefit && targetBuildingQuantity) {
      if (benefit.calculateAsPercent) {
        coins.gain =
          this.#sumPercent(targetBenefit.coinsGain, (benefit.coinsGain * buildingQuantity)) * targetBuildingQuantity;

        coins.gainMultiplier =
          this.#sumPercent(targetBenefit.coinsGainMultiplier, (benefit.coinsGainMultiplier * buildingQuantity)) * targetBuildingQuantity;

        coins.bonusPerQuest =
          this.#sumPercent(targetBenefit.coinsBonusPerQuest, (benefit.coinsBonusPerQuest * buildingQuantity)) * targetBuildingQuantity;

        coins.multiplierPerQuest =
          this.#sumPercent(targetBenefit.coinsMultiplierPerQuest, (benefit.coinsMultiplierPerQuest * buildingQuantity)) * targetBuildingQuantity;
      } else {
        coins.gain =
          ((benefit.coinsGain * buildingQuantity) + targetBenefit.coinsGain) * targetBuildingQuantity;

        coins.gainMultiplier =
          ((benefit.coinsGainMultiplier * buildingQuantity) + targetBenefit.coinsGainMultiplier) * targetBuildingQuantity;

        coins.bonusPerQuest =
          ((benefit.coinsBonusPerQuest * buildingQuantity) + targetBenefit.coinsBonusPerQuest) * targetBuildingQuantity;

        coins.multiplierPerQuest =
          ((benefit.coinsMultiplierPerQuest * buildingQuantity) + targetBenefit.coinsMultiplierPerQuest) * targetBuildingQuantity;
      }
    } else if (benefit.calculateAsPercent) {
      coins.gain = this.#sumPercent(benefit.coinsGain, (benefit.coinsGain * buildingQuantity));
      coins.gainMultiplier = this.#sumPercent(coins.gainMultiplier, (benefit.coinsGainMultiplier * buildingQuantity));
      coins.bonusPerQuest = this.#sumPercent(benefit.coinsBonusPerQuest, (benefit.coinsBonusPerQuest * buildingQuantity));
      coins.multiplierPerQuest = this.#sumPercent(coins.multiplierPerQuest, (benefit.coinsMultiplierPerQuest * buildingQuantity));
    } else {
      coins.gain = benefit.coinsGain * buildingQuantity;
      coins.gainMultiplier = benefit.coinsGainMultiplier * buildingQuantity;
      coins.bonusPerQuest = benefit.coinsBonusPerQuest * buildingQuantity;
      coins.multiplierPerQuest = benefit.coinsMultiplierPerQuest * buildingQuantity;
    }

    return coins;
  }

  #sumPercent(value, percent) {
    if (percent == 0) return 0;
    return value + ((percent / 100) * value);
  }

  #updateUpgradesTitle() {
    let upgradesTitle = this.availableUpgrades.length > 0 ? `${LanguageManager.getData().store.upgradesTitle} (${this.availableUpgrades.length})` : LanguageManager.getData().store.upgradesTitle;
    $("#upgrades.store-section > div.title-section").html(upgradesTitle);

    if (this.availableUpgrades.length == 0)
      $(".container.upgrades").append(`<div class='upgrades-unavailable'>${LanguageManager.getData().store.unavailable}</div>`);
  }

  #setUpBuildings() {
    this.#updateUpgradesTitle();
    $("#buildings.store-section > div.title-section").html(LanguageManager.getData().store.buildingsTitle);
    $("#store > .title.big > span").html(LanguageManager.getData().store.title);

    for (let i = 0; i < this.availableUpgrades.length; i++) {
      let upgrade = GameUpgrades.getUpgradeById(this.availableUpgrades[i].id);
      let tier = this.getTierUpgradeUpdated(upgrade, this.availableUpgrades[i].tier);

      if (tier) {
        GameUpgrades.unlockUpgrade({
          id: upgrade.id,
          canBuy: this.coins >= tier.cost,
          tier: tier.number,
          icon: upgrade.icon,
        });
      }
    }

    if (this.buildingsOwned.length == 0) {
      let startBuilding = GameBuildings.getBuildingById(1);
      GameBuildings.unlockBuilding({
        id: startBuilding.id,
        name: startBuilding.name,
        cost: startBuilding.cost.commafy(),
        canBuy: this.coins >= startBuilding.cost,
        icon: startBuilding.icon,
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

  #unlockNextBuilding(previousBuildingOwned, index) {
    let nextId = previousBuildingOwned.id + 1;
    let isUnlockedPreviousBuilding = GameBuildings.isUnlocked(previousBuildingOwned.id);
    let isUnlockedNextBuilding = GameBuildings.isUnlocked(nextId);

    let nextBuilding = GameBuildings.getBuildingById(nextId);

    // Populate Previous Building
    if (!isUnlockedPreviousBuilding) {
      let building = GameBuildings.getBuildingById(previousBuildingOwned.id);

      building.cost = this.getBuildingCostUpdated(building, previousBuildingOwned.quantity);

      GameBuildings.unlockBuilding({
        id: building.id,
        name: building.name,
        cost: this.#prettyNumber(building.cost),
        countOwned: previousBuildingOwned.quantity,
        canBuy: this.coins >= building.cost,
        icon: building.icon,
      });
    }

    // Populate Next Building
    if (index == -1 || index == this.buildingsOwned.length) {
      if (nextBuilding && !isUnlockedNextBuilding) {
        $("#building-locked").remove();

        GameBuildings.unlockBuilding({
          id: nextBuilding.id,
          name: nextBuilding.name,
          cost: nextBuilding.cost.commafy(),
          canBuy: this.coins >= nextBuilding.cost,
          icon: nextBuilding.icon,
        });
        if (nextBuilding.id < GameBuildings.getCount()) GameBuildings.insertLockedBuilding();
      }
    }
  }

  #unlockUpgrade(building, id) {
    if (building.quantity > 0) {
      $('.upgrades-unavailable').remove();

      let tierNumber;

      switch (building.quantity) {
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
        const upgrade = GameUpgrades.getUpgradeById(id);
        const tier = this.getTierUpgradeUpdated(upgrade, tierNumber);

        if (tier) {
          this.availableUpgrades.push({ id: id, tier: tierNumber, cost: tier.cost, icon: upgrade.icon });
          this.availableUpgrades.sort((a, b) => a.cost - b.cost);
          $('.container.upgrades').html('');

          for (let i = 0; i < this.availableUpgrades.length; i++) {
            const availableUpgrade = this.availableUpgrades[i];

            GameUpgrades.unlockUpgrade({
              id: availableUpgrade.id,
              canBuy: this.coins >= availableUpgrade.cost,
              tier: availableUpgrade.tier,
              icon: availableUpgrade.icon,
            });
          }
        }
      }

      this.#updateUpgradesTitle();
    }
  }

  #welcomeBack() {
    let coinsEarned = 0;
    if (this.getSaveDate() != null) {
      let timeElapsed = Math.floor((new Date().getTime() - this.config.saveDate) / 1000);
      console.log(
        `coinsGain: ${this.coinsGain}  coinsGainMultiplier: ${this.coinsGainMultiplier} timeElapsed: ${timeElapsed}`
      );
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

  #intiGameLoop() {
    this.gameLoop = new GameLoop();
  }

  #setEvents() {
    const gameManager = this;
    $("#chest-button")
      .click(function (e) {
        $(this).removeClass("pressed");
        gameManager.openChest(e);
        Tooltip.hide();
        gameManager.setTooltipChest(false);
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

  #prettyNumber(number) {
    return Number.pretty(number, this.getUnits());
  }
}

export default GameManager;