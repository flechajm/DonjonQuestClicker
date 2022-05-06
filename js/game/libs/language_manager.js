class LanguageManager {
  static #data;

  static getData() {
    return this.#data;
  }

  static async setLanguage(lang) {
    await fetch("./js/lang/" + lang + ".json")
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        this.#data = jsonData;
      });
  }
}

export default LanguageManager;