var gameManager;

$(function () {
  setBackground();
  setFooterTooltips();
  gameManager = GameStateManager.load() ?? new GameManager({});
  gameManager.loadConfig().then(() => {
    GameBuildings.create();
    gameManager.start();
    GameLog.newLine(5);
    GameLog.write(LanguageManager.getData().welcome);
    GameLog.write(
      `${LanguageManager.getData().version} ${GameInfo.version} | ${LanguageManager.getData().lastUpdate} ${
        GameInfo.lastUpdate
      }`,
      "grey"
    );
    GameLog.write(`+ ${GameInfo.briefChanges}`, "lightslategrey");
    GameLog.newLine(1);
  });
});

/**
 * Establece un fondo aleatorio entre todos los que hay disponibles.
 */
function setBackground() {
  let number = randomBetween(1, 19);
  $(".background").css("background-image", "url('/img/bg/bg" + number + ".jpg')");
}

function setFooterTooltips() {
  $("footer > div.social.twitter > a")
    .mousemove(function (e) {
      Tooltip.setTooltip({
        event: e,
        title: "Twitter",
        description: LanguageManager.getData().footer.twitter,
        paddingLock: 10,
        icon: "img/social/twitter32.png",
      });
    })
    .mouseout(function () {
      Tooltip.hide();
    });

  $("footer > div.social.youtube > a")
    .mousemove(function (e) {
      Tooltip.setTooltip({
        event: e,
        title: "YouTube",
        description: LanguageManager.getData().footer.youtube,
        paddingLock: 10,
        icon: "img/social/youtube32.png",
      });
    })
    .mouseout(function () {
      Tooltip.hide();
    });

  $("footer > div.social.github > a")
    .mousemove(function (e) {
      Tooltip.setTooltip({
        event: e,
        title: "GitHub",
        description: LanguageManager.getData().footer.github,
        paddingLock: 10,
        icon: "img/social/github32.png",
      });
    })
    .mouseout(function () {
      Tooltip.hide();
    });
}
