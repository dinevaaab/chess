var BoardConfig = {
    TILE_SIZE : 50,
    BOARD_SIZE: 10,
    IMAGES_DIR: 'img',

    COLORS: {
        WHITE: 'white',
        BLACK: 'black',
    },

    START_COLOR: function () {
        return this.COLORS.WHITE
    },

    FIGURE_TYPES: {
        KING    : 'King',
        QUEEN   : 'Queen',
        BISHOP  : 'Bishop',
        ROOK    : 'Rook',
        KNIGHT  : 'Knight',
        PAWN    : 'Pawn',
    },

    FIGURE_STRENGTH: {
        PAWN    : 1,
        BISHOP  : 2,
        ROOK    : 4,
        KNIGHT  : 5,
        QUEEN   : 7,
        KING    : 7,
    }
};
