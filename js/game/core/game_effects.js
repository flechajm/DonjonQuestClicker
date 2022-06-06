/**
 * Clase encargada de los efectos visuales del juego.
 */
class GameEffects {

    /**
     * Muestra el número de las monedas obtenidas con un efecto de desvanecimiento hacia arriba.
     * @param {Event}   e               Evento.
     * @param {Number}  coinsEarned     Monedas obtenidas a mostrar.
     */
    static spawnCoinsEarned(e, coinsEarned) {
        const cantNumbers = this.#checkQuantityNumbersFloating();
        if (cantNumbers > 100) {
            const obj = $('.coin-floating.number').first();
            obj.remove();
        } else {
            const distnaceBetween = 2;
            let posX = randomBetween(e.pageX - distnaceBetween, e.pageX + distnaceBetween);
            //let posY = randomBetween(0, 50);
            let div = $('<div class="coin-floating number">')
                .css({
                    top: e.pageY - 10,
                    opacity: 1
                })
                .append(`+${coinsEarned}`)
                .appendTo('#donjon');

            posX = posX + 20 - div.width() / 2;
            div.css('left', posX);

            div.animate({ top: e.pageY - 100, opacity: 0 }, 500, "linear", function () {
                $(this).remove();
            });
        }
    }

    /**
     * Muetras un ícono aleatorio que "sale" del cofre.
     * @param {Event}   e   Evento.
     */
    static spawnIconCoin(e) {
        //if (this.#checkQuantityIconsFloating() > 20) return;
        return;

        const coin = $('<div class="coin-floating"><img width="32" height="32" src="/img/coins.png"></img></div>');
        coin.css({
            left: e.pageX + 10,
            top: e.pageY,
        }).appendTo('#donjon');

        let coinPosX = e.pageX;
        let coinPosY = e.pageY;
        let velocityX = Math.floor(Math.random() * 2) + 3;
        let velocityY = -(Math.floor(Math.random() * 2) + 5);
        let opacity = 1;

        if (Math.random() < 0.5) velocityX = -velocityX;

        setInterval(function () {
            coinPosX += velocityX;
            coinPosY += velocityY;
            velocityY += 0.8;
            opacity -= 0.02;

            coin.css("left", coinPosX);
            coin.css("top", coinPosY);
            coin.css({
                left: coinPosX,
                top: coinPosY,
                opacity: opacity
            });

            setTimeout(function () {
                coin.remove();
            }, 500);
        }, 20);
    }

    /**
     * Devuelve la cantidad de elementos (números) flotando actualmente encima del cofre.
     * @returns {Number} Cantidad de números flotando en el cofre.
     */
    static #checkQuantityNumbersFloating() {
        return $('.coin-floating.number').length;
    }

    /**
     * Devuelve la cantidad de imágenes (íconos) flotando actualmente encima del cofre.
     * @returns {Number} Cantidad de íconos flotando en el cofre.
     */
    static #checkQuantityIconsFloating() {
        return $('.coin-floating > img').length;
    }
}

export default GameEffects;