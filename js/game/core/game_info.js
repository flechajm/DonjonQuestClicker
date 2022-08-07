/**
 * Clase que representa información básica del juego.
 */
class GameInfo {
  /**
   * Título del juego.
   */
  static title = "Donjon Quest Clicker";

  /**
   * Versión del juego.
   */
  static version = "0.1a";

  /**
   * Fecha de creación del juego.
   */
  static created = "26 de Diciembre, 2021";

  /**
   * Fecha de la última actualización del juego.
   */
  static lastUpdate = "6 de Agosto, 2022";

  /**
   * Nombre del item del storage.
   */
  static storageName = "DonjonQuestClickerGame";

  /**
   * Descripción corta del último cambio.
   */
  static briefChanges = [
    [
      "Primera versión jugable.",
      "La consola ahora tiene un degradé de transparente a negro.",
      "Se agregaron misiones aleatorias con una probabilidad de 0.25% de que sucedan al hacer clic en el cofre.",
    ],
  ];
}


export default GameInfo;