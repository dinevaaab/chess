/**
 *
 * @param color
 * @constructor
 * @extends Figure
 */
var Knight = function (color) {
    Figure.call(this, color)
    this.type   = BoardConfig.FIGURE_TYPES.KNIGHT;
    this.points = BoardConfig.FIGURE_STRENGTH.KNIGHT;
}

Knight.prototype = Object.create(Figure.prototype);
Knight.prototype.constructor = Knight;