/**
 * Clase encargada del manejo de los ciclos en el juego.
 */
class GameLoop {
  /**
   * Crea una instacia de Loop.
   */
  constructor() {
    /**
     * Monedas que quedan de resto en un ciclo.
     */
    this.coinsRemainder = 0;

    /**
     * Hora de inicio del juego expresada en milisegundos.
     */
    this.timeGameStart = new Date().getTime();

    /**
     * Tiempo jugando, expresado en milisegundos.
     */
    this.timeInGame = 0;

    /**
     * Período de ciclo, expresado en milisegundos. Indica cada cuanto se realiza un ciclo.
     */
    this.loopPeriod = 100;
  }

  gameLoop() {
    let currentLoopTime = new Date().getTime();

    // Diferencia entre el tiempo actual, menos el momento en que empezó el juego, menos el tiempo que está el juego corriendo.
    let timeDiff = currentLoopTime - this.timeGameStart - this.timeInGame;

    if (gameManager.coinsGain != 0) {
      // console.log("-----------------------------");
      // console.log("timeDiff:" + timeDiff);

      //El multiplicador es la diferencia del tiempo transcurrida dividido 1 segundo, ya que el juego se maneja en segundos.
      let timeMultiplier = timeDiff / 1000; //Dividido 1 segundo.
      // console.log("timeMultiplier:" + timeMultiplier);

      // Monedas obtenidas en bruto. Ej.: 26.7
      // let coinsGross = parseInt(gameManager.coinsGain * gameManager.coinsGainMultiplier) * timeMultiplier;
      let coinsGross = gameManager.coinsGain * gameManager.coinsGainMultiplier * timeMultiplier;
      // console.log("coinsGross:" + coinsGross);

      // Monedas obtenidas en neto. Ej.: 26
      let coinsNet = Math.floor(coinsGross);
      // console.log("coinsNet:" + coinsNet);

      // Monedas descartadas para el próximo ciclo. Ej.: 0.7
      let coinsDiscarded = coinsGross - coinsNet;
      // console.log("coinsDiscarded:" + coinsDiscarded);

      // Monedas descartadas que se suman al resto. Ej.: Si el resto anterior era 0.4 y se agregan 0.7, tendremos 1.1 monedas de resto bruto, de las cuáles para el ciclo siguiente se descartarán 0.1 para el subsiguiente ciclo.
      this.coinsRemainder += coinsDiscarded;
      // console.log("coinsRemainder:" + this.coinsRemainder);

      // Monedas de resto en neto. Ej.: 1
      let coinsRemainderNet = Math.floor(this.coinsRemainder);
      // console.log("coinsRemainderNet:" + coinsRemainderNet);

      // Monedas de resto bruto que se restan a las monedas de resto. Ej.: 1.1 - 1 = 0.1
      this.coinsRemainder -= coinsRemainderNet;
      // console.log("coinsRemainder:" + this.coinsRemainder);

      // Se agregan las monedas netas correspondientes entre lo recibido (neto) y el resto (neto).
      gameManager.addCoins(coinsNet + coinsRemainderNet);
      // console.log("coin:" + coinsNet + coinsRemainderNet);
    }

    // Incremento del tiempo de juego.
    this.timeInGame += timeDiff;

    // Chequeo de edificios y/o mejoras disponibles.
    gameManager.checkBuildingsAvailable();

    setTimeout(() => {
      this.gameLoop();
    }, this.loopPeriod);
  }

  saveLoop() {
    // GameStateManager.save();
    // Tooltip.setTooltip({
    //   id: "save",
    //   title: "Progreso guardado",
    // });
    // Tooltip.show();

    // setTimeout(() => {
    //   Tooltip.hide();
    //   this.saveLoop();
    // }, 3000);
  }
}