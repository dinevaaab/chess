var Figure = function (color) {
    this.type       = '';
    this.color      = color;
    this.points     = 0;
}

Figure.prototype.getType = function () {
    return this.type;
}

Figure.prototype.getColor = function () {
    return this.color;
}

Figure.prototype.getCode = function () {
    return this.color[0] + this.type[0] + this.type[1];
}

Figure.prototype.getPoints = function () {
    return this.points;
}

Figure.prototype.getImagePath = function () {
    var imagePath = BoardConfig.IMAGES_DIR + '/';
    switch (this.color) {
        case BoardConfig.COLORS.WHITE:
            imagePath += 'w';
            break;
        case BoardConfig.COLORS.BLACK:
            imagePath += 'b';
            break;
    }
    imagePath += this.type + '.png';

    return imagePath;
}