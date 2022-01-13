/**
 * Clase encargada del manejo del estado del juego.
 */
class GameStateManager {
  static save() {
    gameManager.config.saveDate = new Date().getTime();
    localStorage.setItem(GameInfo.storageName, JSON.stringify(gameManager).encrypt());
  }

  static load() {
    let gameManager = localStorage.getItem(GameInfo.storageName);
    if (gameManager) {
      return new GameManager(JSON.parse(localStorage.getItem(GameInfo.storageName).decrypt()));
    }
  }
}
