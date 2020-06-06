/**
 *
 * @param color
 * @constructor
 * @extends Figure
 */
var King = function (color) {
    Figure.call(this, color)
    this.type   = BoardConfig.FIGURE_TYPES.KING;
    this.points = BoardConfig.FIGURE_STRENGTH.KING;
}

King.prototype = Object.create(Figure.prototype);
King.prototype.constructor = King;
