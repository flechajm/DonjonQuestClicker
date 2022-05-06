/**
 * Clase que representa la configuración del juego.
 */
class GameConfig {
  /**
   * Crea la instancia de Configuración.
   * @param {GameConfig} GameConfig Puede recibir una configuración para precargar o no, y crearla por defecto.
   */
  constructor(config) {
    /**
     * Volumen del juego. Valor por defecto: 8.
     */
    this.volume = config?.volume ?? 0.8;

    /**
     * Lenguage del juego. Valor por defecto: 'es'.
     */
    this.lang = config?.lang ?? "es";

    /**
     * Fecha en la que se guardó el juego, expresada en milisegundos.
     */
    this.saveDate = config?.saveDate ?? null;
  }
}

export default GameConfig;