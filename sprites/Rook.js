/**
 *
 * @param color
 * @constructor
 * @extends Figure
 */
var Rook = function (color) {
    Figure.call(this, color)
    this.type   = BoardConfig.FIGURE_TYPES.ROOK;
    this.points = BoardConfig.FIGURE_STRENGTH.ROOK;
}

Rook.prototype = Object.create(Figure.prototype);
Rook.prototype.constructor = Rook;