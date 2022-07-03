import GameManager from "./core/game_manager.js";
import GameStateManager from "./core/game_state_manager.js";
import GameLog from "./core/game_log.js";
import GameInfo from "./core/game_info.js";
import GameBuildings from "./core/game_buildings.js";
import GameUpgrades from "./core/game_upgrades.js";

import LanguageManager from "./libs/language_manager.js"
import AudioManager from "./libs/audio_manager.js";
import Tooltip from "./libs/tooltip.js";

let imageDirectories = [['img', '.png'], ['img/bg', '.jpg'], ['img/buildings', '.png'], ['img/social', '.png']];
let directoriesLoaded = 0;

var gameManager;
var audioManager;

$(function () {
  setBackground();
  setFooterTooltips();
  gameManager = GameStateManager.load() ?? new GameManager({});
  gameManager.loadConfig().then(() => {
    GameLog.write(LanguageManager.getData().welcome);
    GameLog.write(
      `${LanguageManager.getData().version} ${GameInfo.version} | ${LanguageManager.getData().lastUpdate} ${GameInfo.lastUpdate
      }`,
      "grey"
    );
    GameLog.write(`+ ${GameInfo.briefChanges}`, "lightslategrey");
    GameLog.newLine(1);

    GameBuildings.create();
    GameUpgrades.create();

    gameManager.start();
    audioManager = new AudioManager();
    audioManager.init();
  }).then(() => {
    imageDirectories.forEach((imageDirectory) => {
      let directory = imageDirectory[0];
      let fileExtension = imageDirectory[1];
      preloadImages(directory, fileExtension);
    });
  });
});

function preloadImages(dir, fileextension) {
  $.ajax({
    url: dir,
    success: function (data) {
      $(data).find("a:contains(" + fileextension + ")").each(function () {
        let filename = String(this.href.replace(window.location.host, "").replace("http://", "")).substring(1);
        let tempImg = new Image();
        tempImg.src = filename;
        console.log(filename);
      });
    },
    complete: function () {
      directoriesLoaded++;

      if (directoriesLoaded >= imageDirectories.length) {
        document.getElementById('loader').style.visibility = "hidden";
      }
    }
  });
}

/**
 * Establece un fondo aleatorio entre todos los que hay disponibles.
 */
function setBackground() {
  let number = randomBetween(1, 19);
  $(".background").css("background-image", "url('img/bg/bg" + number + ".jpg')");
}

function setFooterTooltips() {
  $("footer > div.content > div.social.twitter > a")
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

  $("footer > div.content > div.social.youtube > a")
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

  $("footer > div.content > div.social.github > a")
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

  $("footer > div.music > span:first")
    .mousemove(function (e) {
      Tooltip.setTooltip({
        event: e,
        description: `${LanguageManager.getData().footer.music.createdBy}<ul><li>Alexander Nakarada <a href='https://www.serpentsoundstudios.com' target='_blank'>(Website)</a></li><li>Ean Grimm <a href='https://youtube.com/c/Musicforyoursoul' target='_blank'>(YouTube)</a></li></ul>${LanguageManager.getData().footer.music.license}<a href='http://creativecommons.org/licenses/by/4.0/' target='_blank'>Creative Commons BY Attribution 4.0</a>`,
        paddingLock: 2,
        position: 'left',
      });
    })
    .mouseout(function () {
      if (!Tooltip.getShiftPressed()) {
        Tooltip.hide();
      }
    });
}

export { gameManager, audioManager };