/**
 * Clase encargada del manejo de los tooltips.
 */
class Tooltip {
  /**
   * Representa el elemento DOM '#tooltip'.
   */
  static #tooltip;

  /**
   * Representa el elemento DOM 'div.header-wrapper'.
   */
  static #headerWrapper;

  /**
   * Representa el elemento DOM 'div.header-container'.
   */
  static #headerContainer;

  /**
   * Representa el elemento DOM 'div.cost'.
   */
  static #cost;

  /**
   * Representa el elemento DOM 'div.level'.
   */
  static #level;

  /**
   * Representa el elemento DOM 'div.content'.
   */
  static #content;

  /**
   * Muestra un tooltip con información.
   *
   * El tooltip se muestra por defecto por encima del mouse y puede contener información tanto para los edificios y las mejoras como para cualquier elemento del juego al que se le quiera describir.
   * @param {event}   event         Evento de la función que lo llamó. Indispensable para obtener las coordenadas de movimiento del mouse.
   * @param {String}  title         Título.
   * @param {String}  subtitle      Subtítulo. [Opcional].
   * @param {String}  description   La descripción del tooltip puede ser texto plano o HTML.
   * @param {String}  icon          Ícono que se mostrará en la parte superior izquierda del tooltip. [Opcional].
   * @param {Number}  cost          Corresponde al valor de un edificio o mejora. [Opcional].
   * @param {Number}  level         Nivel del edificio. [Opcional].
   * @param {String}  position      Indica en qué posición se mostrará tomando en cuenta las coordenadas del mouse. Los valores posibles son: 'top', 'right', 'bottom', 'left'. Valor por defecto: 'top'.
   * @param {Boolean} canBuy        Indica si se puede comprar o no un edificio. Tiene sentido únicamente cuando el parámetro {cost} valor.
   * @param {Number}  extraPadding  Añade un margen extra (al ya predefinido) entre el mouse y el tooltip. [Opcional].
   * @param {Arrays}  gameUnits     Unidades de números.
   */
  static setTooltip({
    event,
    title = null,
    subtitle = null,
    description = null,
    icon = null,
    cost = null,
    level = null,
    position = "top",
    canBuy = null,
    extraPadding = null,
    paddingLock = null,
    gameUnits = null
  }) {
    extraPadding = extraPadding ?? 20;
    let padding = 26;
    let paddingTop;
    let paddingLeft;
    let center;
    let separator = '<div class="separator"></div>';

    this.#tooltip = $("#tooltip");
    this.#tooltip.width(cost ? 430 : 330);
    this.#headerWrapper = this.#tooltip.find("div.header-wrapper");
    this.#headerContainer = this.#headerWrapper.find("div.container");
    this.#cost = this.#headerWrapper.find("div.cost");
    this.#level = this.#headerWrapper.find("div.level");
    this.#content = this.#tooltip.find("div.content");

    this.#headerWrapper.find("div.icon").css({
      background: `url(${icon}) no-repeat center center / cover`,
      display: icon ? "block" : "none",
    });

    this.#headerContainer.find("div.title").html(title ?? "");
    this.#headerContainer.find("div.subtitle").html(subtitle ?? "");
    this.#cost.find("div.hidden-value").html(cost ?? "");
    this.#cost.find("div.value").html(Number.pretty(cost, gameUnits) ?? "");
    this.#cost.find("div.value").toggleClass("unavailable", !canBuy);
    this.#level.find("div.subtitle").html(level ?? "");
    this.#content.html(description?.replaceAll("@separator@", separator));
    this.#content.toggleClass("no-margin", title == null);

    let paddingHeight = 0;
    let paddingWidth = 0;
    if (position == "top" || position == "bottom") {
      center = this.#tooltip.width() / 2;
      paddingHeight = this.#tooltip.height();
    } else if (position == "left" || position == "right") {
      center = this.#tooltip.height() / 2;
      paddingWidth = this.#tooltip.width();
    }

    this.#tooltip.css({ top: "", right: "", bottom: "", left: "" });

    switch (position) {
      case "top":
        paddingTop = -paddingHeight - padding - extraPadding;
        paddingLeft = -center;

        this.#setPaddingLock(event, "bottom", paddingLock);
        break;
      case "right":
        paddingTop = -center;
        paddingLeft = padding + extraPadding;

        this.#setPaddingLock(event, "left", paddingLock);
        break;
      case "bottom":
        paddingTop = padding + extraPadding;
        paddingLeft = -center;

        this.#setPaddingLock(event, "top", paddingLock);
        break;
      case "left":
        paddingTop = -center;
        paddingLeft = -paddingWidth - padding - extraPadding;

        this.#setPaddingLock(event, "right", paddingLock);
        break;

      default:
        break;
    }

    if (event != null) {
      if (paddingLock == null) {
        this.#mouseMove({ event: event, paddingTop: paddingTop, paddingLeft: paddingLeft });
      } else {
        if (position == "left" || position == "right") {
          this.#mouseMove({ event: event, paddingTop: paddingTop });
        } else if (position == "top" || position == "bottom") {
          this.#mouseMove({ event: event, paddingLeft: paddingLeft });
        }
      }

      this.show();
    }
  }

  static #setPaddingLock(event, paddingPosition, paddingLock) {
    if (event != null && paddingLock != null) {
      this.#tooltip.css(paddingPosition, `${paddingLock}px`);
    }
  }

  static #mouseMove({ event, paddingTop, paddingLeft }) {
    if (paddingTop) {
      this.#tooltip.css("top", `${event.pageY + paddingTop}px`);
    }

    if (paddingLeft) {
      this.#tooltip.css("left", `${event.pageX + paddingLeft}px`);
    }

    if (parseInt(this.#tooltip.css('top'), 10) < 0)
      this.#tooltip.css("top", 0);
  }

  /**
   * Actualiza el cost del edificio y/o mejora actual mostrado en el tooltip.
   * @param {Number} coins Monedas actuales.
   */
  static updateCost(coins) {
    if (this.#headerWrapper) {
      let cost = this.#cost.find("div.hidden-value").html();
      this.#cost.find("div.value").toggleClass("unavailable", cost > coins);
    }
  }

  /**
   * Muestra el tooltip.
   */
  static show() {
    this.#tooltip.show();
  }

  /**
   * Oculta el tooltip.
   */
  static hide() {
    if (this.#tooltip != null && this.#tooltip.length == 1) this.#tooltip.hide();
  }
}

export default Tooltip;