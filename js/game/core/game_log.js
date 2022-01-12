class Log {
  static logDOM = $("#log > div.text");

  static write(html, color) {
    this.logDOM.append(`<span style="color: ${color ?? "inherit"};">${html}</span>`);
    this.newLine();
  }

  static newLine(cant) {
    this.logDOM.append("<br />".repeat(cant ?? 1));
  }
}
