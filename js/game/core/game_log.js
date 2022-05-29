import LanguageManager from "../libs/language_manager.js";

class GameLog {
  static logDOM = $("#log > div.text");
  static MAX_MESSAGES = 200;
  static countMessages = 0;

  static #append(html) {
    this.logDOM.append(html)
      .children(':last')
      .hide()
      .fadeIn(500);
    this.logDOM.append("<br />");
    this.logDOM.animate(
      {
        scrollTop: this.logDOM[0].scrollHeight
      },
      0
    );
    if (this.countMessages >= this.MAX_MESSAGES) {
      this.logDOM.html('');
      this.countMessages = 0;
    } else {
      this.countMessages++;
    }
  }

  static write(html, color) {
    this.#append(`<span style="color: ${color ?? "inherit"};">${html}</span>`);
  }

  static newLine(cant) {
    this.#append("<br />".repeat(cant ?? 1));
  }

  static writeSaveProgress() {
    this.write(`${LanguageManager.getData().saveProgress} [${new Date().toLocaleString()}]`, "grey");
  }
}

export default GameLog;