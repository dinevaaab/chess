/**
 *
 * @param color
 * @constructor
 * @extends Figure
 */
var Queen = function (color) {
    Figure.call(this, color)
    this.type   = BoardConfig.FIGURE_TYPES.QUEEN;
    this.points = BoardConfig.FIGURE_STRENGTH.QUEEN;
}

Queen.prototype = Object.create(Figure.prototype);
Queen.prototype.constructor = Queen;