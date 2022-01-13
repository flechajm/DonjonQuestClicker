class GameManager {
  #basePow;
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
    buildingsOwned,
    config,
  }) {
    this.heroName = heroName ?? "John Arrow";
    this.coins = coins ?? 0;
    this.coinsGain = coinsGain ?? 0;
    this.coinsGainMultiplier = coinsGainMultiplier ?? 1;
    this.coinsPerQuest = coinsPerQuest ?? 1;
    this.coinsBonusPerQuest = coinsBonusPerQuest ?? 0;
    this.coinsMultiplierPerQuest = coinsMultiplierPerQuest ?? 1;
    this.buildingsOwned = buildingsOwned ?? [];
    this.config = new GameConfig(config);
    this.gameLoop = new GameLoop();
    this.#basePow = 1.12;
    this.#units = [];
    this.#showTooltipChest = true;
  }

  async loadConfig() {
    await LanguageManager.setLanguage(this.config.lang);
  }

  start() {
    this.#setEvents();
    this.#configure();

    setInterval(function () {
      gameManager.updateTitle();
    }, 1000);

    this.gameLoop.saveLoop();
    this.gameLoop.gameLoop();
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

  openChest() {
    let coinsEarned = Math.ceil((this.coinsPerQuest + this.coinsBonusPerQuest) * this.coinsMultiplierPerQuest);
    this.addCoins(coinsEarned);
  }

  addCoins(quantity, isLoading) {
    if (!isLoading) this.coins += quantity;

    $("#coins").html(`${this.getCoinsFormatted(true)} <span>${LanguageManager.getData().coins}</span>`);
    $("#coins.per-sec").html(this.coinsGain);
  }

  #substractCoins(quantity) {
    this.coins -= quantity;
    $("#coins").html(`${this.getCoinsFormatted()} <span>${LanguageManager.getData().coins}</span>`);
  }

  getCoinsFormatted(returnPrettyNumber) {
    return returnPrettyNumber ? this.coins.prettyNumber() : String(this.coins).commafy();
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
      document.title = `${this.getCoinsFormatted(true)} ${preposition} ${LanguageManager.getData().coins} - ${
        GameInfo.title
      }`;
    }
  }

  getBasePow() {
    return this.#basePow;
  }

  checkBuildingsAvailable() {
    let length = GameBuildings.getCount() + 1;
    for (let i = 1; i < length; i++) {
      const building = GameBuildings.getById(i);
      const button = $(`#building-${building.id}`);

      if (!button) return;

      if (building.cost > gameManager.coins) {
        button.addClass("disabled");
        button.unbind("mouseup");
      } else {
        Tooltip.updateCost(gameManager.coins);
        button.removeClass("disabled");
        button.unbind("mouseup").mouseup(function (e) {
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

  getBuildingOwnedById(id) {
    return this.buildingsOwned.find((b) => b.id == id);
  }

  getBuildingCostUpdated(building, quantity) {
    return Math.ceil(building.baseCost * Math.pow(this.#basePow, quantity));
  }

  buyBuilding(id, quantity) {
    let building = this.getBuildingOwnedById(id);
    let owned = $(`#building-${id} > div.building-count-owned`);

    if (building) {
      building.quantity += quantity;
    } else {
      this.buildingsOwned.push({ id: id, quantity: quantity });
      building = this.getBuildingOwnedById(id);
    }

    this.#substractCoins(GameBuildings.getById(id).cost);
    this.#addBuildingBenefits(id, quantity);
    this.#updateBuildingCost(id, building.quantity);
    this.#unlockNextBuilding(building, -1);

    owned.html(building.quantity);
  }

  bindTooltipFunctionToBuildingButton(e, building) {
    let quantity = gameManager.getBuildingOwnedById(building.id)?.quantity ?? 0;
    let benefits = building.benefits.map((benefit) => `<li>${benefit.description}</li>`).join("");

    Tooltip.setTooltip({
      event: e,
      title: building.name,
      subtitle: `${LanguageManager.getData().quantity}: ${quantity}`,
      description: `@separator@${building.description}<br /><br /><b><u>${
        LanguageManager.getData().benefits
      }:</u></b><br /><ul>${benefits}</ul>@separator@<span class='quote'>${building.quote}</span>`,
      icon: `/img/buildings/${building.id}.png`,
      cost: building.cost,
      canBuy: gameManager.coins >= building.cost,
      position: "left",
      paddingLock: $(document).width() - $("#divider-buildings").position().left,
    });
  }

  #configure() {
    this.buildingsOwned.sort((a, b) => a.id - b.id);
    this.setHeroName(this.heroName);
    this.#welcomeBack();
    this.#addUnits();
    this.#setUpBuildings();
  }

  getUnits() {
    return this.#units;
  }

  #addUnits() {
    let units = LanguageManager.getData().formatUnit.units;
    let prefixes = LanguageManager.getData().formatUnit.prefixes;
    let suffixes = LanguageManager.getData().formatUnit.suffixes;

    this.#units.push.apply(this.#units, units);

    prefixes.forEach((p) => {
      suffixes.forEach((s) => {
        this.#units.push(` ${p + s}`);
      });
    });
  }

  #updateBuildingCost(id, quantity) {
    let building = GameBuildings.getById(id);
    building.cost = this.getBuildingCostUpdated(building, quantity);

    let cost = $(`#building-${id} > div.building-cost`);
    cost.html(building.cost.prettyNumber());
  }

  #addBuildingBenefits(buildingId, buildingQuantity) {
    let building = GameBuildings.getById(buildingId);

    building.benefits.forEach((benefit) => {
      this.coinsGain += benefit.coinsGain * buildingQuantity;
      this.coinsGainMultiplier += benefit.coinsGainMultiplier * buildingQuantity;
      this.coinsBonusPerQuest += benefit.coinsBonusPerQuest * buildingQuantity;
      this.coinsMultiplierPerQuest += benefit.coinsMultiplierPerQuest * buildingQuantity;
    });
  }

  #setUpBuildings() {
    $("#upgrades.store-section").html(LanguageManager.getData().store.upgradesTitle);
    $("#buildings.store-section").html(LanguageManager.getData().store.buildingsTitle);
    $("#store > .title.big > span").html(LanguageManager.getData().store.title);

    if (this.buildingsOwned.length == 0) {
      let startBuilding = GameBuildings.getById(1);
      GameBuildings.unlockBuilding({
        id: startBuilding.id,
        name: startBuilding.name,
        cost: startBuilding.cost.commafy(),
        canBuy: this.coins >= startBuilding.cost,
      });
      GameBuildings.insertLockedBuilding();
    } else {
      for (let i = 1; i < this.buildingsOwned.length + 1; i++) {
        const buildingOwned = this.getBuildingOwnedById(i);
        this.#unlockNextBuilding(buildingOwned, i);
      }
    }
  }

  #unlockNextBuilding(previousBuildingOwned, index) {
    let nextId = previousBuildingOwned.id + 1;
    let isUnlockedPreviousBuilding = GameBuildings.isUnlocked(previousBuildingOwned.id);
    let isUnlockedNextBuilding = GameBuildings.isUnlocked(nextId);

    let nextBuilding = GameBuildings.getById(nextId);

    // Populate Previous Building
    if (!isUnlockedPreviousBuilding) {
      let building = GameBuildings.getById(previousBuildingOwned.id);

      building.cost = this.getBuildingCostUpdated(building, previousBuildingOwned.quantity);

      GameBuildings.unlockBuilding({
        id: building.id,
        name: building.name,
        cost: building.cost.prettyNumber(),
        countOwned: previousBuildingOwned.quantity,
        canBuy: this.coins >= building.cost,
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
        });
        if (nextBuilding.id < GameBuildings.getCount()) GameBuildings.insertLockedBuilding();
      }
    }
  }

  #welcomeBack() {
    if (this.getSaveDate() != null) {
      let timeElapsed = Math.floor((new Date().getTime() - this.config.saveDate) / 1000);
      console.log(
        `coinsGain: ${this.coinsGain}  coinsGainMultiplier: ${this.coinsGainMultiplier} timeElapsed: ${timeElapsed}`
      );
      this.coins += Math.ceil(this.coinsGain * this.coinsGainMultiplier * timeElapsed);
    }

    this.addCoins(this.coins, true);
  }

  #setEvents() {
    $("#chest-button")
      .mouseup(function () {
        $(this).removeClass("pressed");
        gameManager.openChest();
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
          });
        }
      });

    $("#donjon-heroname").mouseup(function () {
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
}