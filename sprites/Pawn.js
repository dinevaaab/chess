/**
 *
 * @param color
 * @constructor
 * @extends Figure
 */
var Pawn = function (color) {
    Figure.call(this, color)
    this.type   = BoardConfig.FIGURE_TYPES.PAWN;
    this.points = BoardConfig.FIGURE_STRENGTH.PAWN;
}

Pawn.prototype = Object.create(Figure.prototype);
Pawn.prototype.constructor = Pawn