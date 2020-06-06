/**
 *
 * @param color
 * @constructor
 * @extends Figure
 */
var Bishop = function (color) {
    Figure.call(this, color)
    this.type   = BoardConfig.FIGURE_TYPES.BISHOP;
    this.points = BoardConfig.FIGURE_STRENGTH.BISHOP;
}

Bishop.prototype = Object.create(Figure.prototype);
Bishop.prototype.constructor = Bishop;