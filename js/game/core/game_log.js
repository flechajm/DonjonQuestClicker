class GameLog {
  static logDOM = $("#log > div.text");

  static #append(html) {
    this.logDOM.append(html);
    this.logDOM.append("<br />");
    this.logDOM.animate(
      {
        scrollTop: this.logDOM.offset().top,
      },
      2000
    );
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
