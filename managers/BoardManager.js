/**
 *
 * @param {HTMLElement} canvas
 * @param {HTMLElement} points
 * @constructor
 */
var BoardManager = function (canvas, points) {
    this.canvas         = canvas;
    this.pointsElement  = points;
    this.context        = this.canvas.getContext('2d');
    this.boardSize      = BoardConfig.BOARD_SIZE;
    this.activeColor    = BoardConfig.START_COLOR();

    this.counterPointsWhite     = 0;
    this.counterFiguresWhite    = 0;

    this.counterPointsBlack     = 0;
    this.counterFiguresBlack    = 0;

    this.selectedPiece          = null;

    this.checkMovesKingArray    = null;
    this.chessKingActiveColor   = false;
    this.chessKingInActiveColor = false;
    this.kingX                  = null;
    this.kingY                  = null;

    this.newX                   = null;
    this.newY                   = null;
    this.oldX                   = null;
    this.oldY                   = null;


    this.pointsElement.innerText = `White points : ${this.counterPointsWhite}, Black points: ${this.counterPointsBlack}`;


    this.canvas.addEventListener('click', this.grabClickEvent.bind(this))

    this.board = this.initBoard();

    this.movePieceArray = [
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null]
    ]

    this.drawBoard();
    this.drawPiece();
    this.showSelected();
};

BoardManager.prototype.initBoard = function() {
    var board = [
        ["bRo", "bKn", "bBi", "bQu", "bKi", null, null, null, null, null],
        ["bPa", "bPa", "bPa", "bPa", "bPa", null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        ["wPa", "wPa", "wPa", "wPa", "wPa", null, null, null, null, null],
        ["wRo", "wKn", "wBi", "wQu", "wKi", null, null, null, null, null]
    ]
    return this.arrayToFigureObjects(board.map(x => {
        return x.slice();
    }));
}

BoardManager.prototype.arrayToFigureObjects = function(arrayOfFigures) {
    return arrayOfFigures.map(function (internalArray) {
        return internalArray.map(function (figureCode) {
            if (figureCode !== null && figureCode.length >= 3) {
                var figure = null
                var color = figureCode[0];
                var type = figureCode[1] + figureCode[2];

                switch (color) {
                    case 'w':
                        color = BoardConfig.COLORS.WHITE;
                        break;
                    case 'b':
                        color = BoardConfig.COLORS.BLACK;
                        break;
                }

                switch (type) {
                    case 'Ro':
                        figure = new Rook(color);
                        break;
                    case 'Kn':
                        figure = new Knight(color);
                        break;
                    case 'Bi':
                        figure = new Bishop(color);
                        break;
                    case 'Qu':
                        figure = new Queen(color);
                        break;
                    case 'Ki':
                        figure = new King(color);
                        break;
                    case 'Pa':
                        figure = new Pawn(color);
                        break;
                }

                if (figure !== null && figureCode === figure.getCode()) {
                    return figure;
                }
            }

            return null;
        })

    })
}

BoardManager.prototype.grabClickEvent = function (event) {
    var x = Math.trunc(event.pageX / BoardConfig.TILE_SIZE);
    var y = Math.trunc(event.pageY / BoardConfig.TILE_SIZE);

    console.log(this.oldX, this.oldY);
    if (this.selectedPiece !== null && this.movePieceArray[y][x] !== null) {
        if (this.board[y][x] !== null && this.activeColor === BoardConfig.COLORS.WHITE) {
            this.counterFiguresBlack--; // След взимане на фигура, броят на фигурите се намалява с 1
            this.counterPointsWhite += this.board[y][x].getPoints(); // След взимане на фигура се добавят точки към играча за тази фигура
            this.pointsElement.innerText = `White points : ${this.counterPointsWhite}, Black points: ${this.counterPointsBlack}`; // отпечатване на точките за играчите
        } else if (this.board[y][x] !== null && this.activeColor === BoardConfig.COLORS.BLACK) {
            this.counterFiguresWhite--; // След взимане на фигура, броят на фигурите се намалява с 1
            this.counterPointsBlack += this.board[y][x].getPoints(); // След взимане на фигура се добавят точки към играча за тази фигура
            this.pointsElement.innerText = `White points : ${this.counterPointsWhite}, Black points: ${this.counterPointsBlack}`; // отпечатване на точките за играчите

        }
        var fig = this.board[y][x]; // запазваме взетата фигура
        console.log(fig);
        this.newX = x;
        this.newY = y;
        console.log(this.newX, this.newY);

        if (fig === null || fig.getType() !== BoardConfig.FIGURE_TYPES.KING) {
            // проверка, ако не е цар, взетата фигура се заменя със вземащата и на нейно място в масива става null
            this.board[y][x] = this.board[this.selectedPiece.sy][this.selectedPiece.sx];
            this.board[this.selectedPiece.sy][this.selectedPiece.sx] = null;
            this.checkMovesKingArray = this.movePieceArray.map(x => {
                return x.slice();
            });
        }

        this.checkMovesForKing();
        if (this.chessKingActiveColor) {
            alert("Този ход не е възможен, застрашен е царят");
            this.movePieceArray = this.checkMovesKingArray.map(x => {
                return x.slice();
            });
            this.board[this.oldY][this.oldX] = this.board[this.newY][this.newX];
            this.board[this.newY][this.newX] = fig; //Връщаме взетата фигура
            this.newX = this.oldX;
            this.newY = this.oldY;
        } else if (this.chessKingInActiveColor) {
            alert(" Ти си тъп ШАХ");
            if (this.activeColor === BoardConfig.COLORS.WHITE) {
                // Обръщане на дъската в зависимост кой е на ход
                this.activeColor = BoardConfig.COLORS.BLACK;
                this.board = this.board.reverse();
            } else {
                this.activeColor = BoardConfig.COLORS.WHITE;
                this.board = this.board.reverse();
            }
        } else if (!this.chessKingActiveColor && !this.chessKingInActiveColor) {
            if (this.activeColor === BoardConfig.COLORS.WHITE) {
                // Обръщане на дъската в зависимост кой е на ход
                this.activeColor = BoardConfig.COLORS.BLACK;
                this.board = this.board.reverse();
            } else {
                this.activeColor = BoardConfig.COLORS.WHITE;
                this.board = this.board.reverse();
            }
        }

        this.selectedPiece = null;
    } else if (this.board[y][x] !== null && this.board[y][x].getColor() === this.activeColor) {
        // селектиране на фигура според цвета на активния играч
        this.selectedPiece = { sx: x, sy: y };
    } else {
        this.selectedPiece = null;
    }

    for (var i = 0; i < this.movePieceArray.length; i++) {
        //зануляване на масива с ходове за фигурата която е играла
        for (var j = 0; j < this.movePieceArray.length; j++) {
            this.movePieceArray[i][j] = null;
        }
    }

    this.chessEquality();
    this.drawBoard();
    this.drawPiece();

    if (this.selectedPiece !== null) {
        this.showSelected();
        this.oldX = x;
        this.oldY = y;
        switch (this.board[y][x].getType()) {
            case BoardConfig.FIGURE_TYPES.PAWN:
                this.pawn(this.selectedPiece.sx, this.selectedPiece.sy);
                break;
            case BoardConfig.FIGURE_TYPES.BISHOP:
                this.bishop();
                break;
            case BoardConfig.FIGURE_TYPES.ROOK:
                this.rook();
                break;
            case BoardConfig.FIGURE_TYPES.QUEEN:
                this.queen();
                break;
            case BoardConfig.FIGURE_TYPES.KING:
                this.king();
                break;
            case BoardConfig.FIGURE_TYPES.KNIGHT:
                this.knight();
                break;
        }
    }
}


//зареждане на снимки на фигурите
BoardManager.prototype.drawingImage = function(x, y, url) {
    var img = new Image();
    img.onload = () => {
        this.context.drawImage(img, x * 50, y * 50, BoardConfig.TILE_SIZE, BoardConfig.TILE_SIZE);
    };
    img.src = url;
};

//показване на фигурите
BoardManager.prototype.drawPiece = function () {
    for (var x = 0; x < this.boardSize; x++) {
        for (var y = 0; y < this.boardSize; y++) {
            var figure = this.board[y][x]
            if (figure !== null) {
                    this.drawingImage(x, y, figure.getImagePath());
            }
        }
    }
};

BoardManager.prototype.checkMovesForKing = function () {
    this.chessKingInActiveColor = false;
    this.chessKingActiveColor = false;
    for (var i = 0; i < this.movePieceArray.length; i++) {
        //зануляване на масива с ходове за фигурата която е играла
        for (var j = 0; j < this.movePieceArray.length; j++) {
            this.movePieceArray[i][j] = null;
        }
    }
    if (this.newX !== null && this.newY !== null) {
        for (var y = 0; y < this.movePieceArray.length; y++) {
            for (var x = 0; x < this.movePieceArray.length; x++) {
                if (this.board[y][x] !== null && this.board[y][x].getColor() !== this.activeColor) {
                    this.selectedPiece.sx = x;
                    this.selectedPiece.sy = y;
                    switch (this.board[y][x].getType()) {
                        case BoardConfig.FIGURE_TYPES.PAWN:
                            this.pawn(this.selectedPiece.sx, this.selectedPiece.sy, -1);
                            break;
                        case BoardConfig.FIGURE_TYPES.BISHOP:
                            this.bishop();
                            break;
                        case BoardConfig.FIGURE_TYPES.ROOK:
                            this.rook();
                            break;
                        case BoardConfig.FIGURE_TYPES.QUEEN:
                            this.queen();
                            break;
                        case BoardConfig.FIGURE_TYPES.KING:
                            this.kingX = x;
                            this.kingY = y;
                            this.king();
                            break;
                        case BoardConfig.FIGURE_TYPES.KNIGHT:
                            this.knight();
                            break;
                    }
                }

                if (
                    this.board[y][x] !== null &&
                    this.board[y][x].getType() === BoardConfig.FIGURE_TYPES.KING &&
                    this.board[y][x].getColor() === this.activeColor &&
                    this.movePieceArray[y][x] === "attack"
                ) {
                    this.chessKingActiveColor = true;
                }
                if (this.board[y][x] !== null && this.board[y][x].getColor() === this.activeColor) {
                    this.selectedPiece.sx = x;
                    this.selectedPiece.sy = y;
                    switch (this.board[y][x].getType()) {
                        case BoardConfig.FIGURE_TYPES.PAWN:
                            this.pawn(this.selectedPiece.sx, this.selectedPiece.sy, 1);
                            break;
                        case BoardConfig.FIGURE_TYPES.BISHOP:
                            this.bishop();
                            break;
                        case BoardConfig.FIGURE_TYPES.ROOK:
                            this.rook();
                            break;
                        case BoardConfig.FIGURE_TYPES.QUEEN:
                            this.queen();
                            break;
                        case BoardConfig.FIGURE_TYPES.KING:
                            this.king();
                            break;
                        case BoardConfig.FIGURE_TYPES.KNIGHT:
                            this.knight();
                            break;
                    }
                }
                if (
                    this.kingX !== null &&
                    this.kingY !== null &&
                    this.board[this.kingY][this.kingX] !== null &&
                    this.board[this.kingY][this.kingX].getType() === BoardConfig.FIGURE_TYPES.KING &&
                    this.board[this.kingY][this.kingX].getColor() !== this.activeColor &&
                    this.movePieceArray[this.kingY][this.kingX] === "attack"
                ) {
                    this.chessKingInActiveColor = true;
                }
            }
        }
    }
};

//условие за реми
BoardManager.prototype.chessEquality = function() {
    if (this.counterFiguresWhite === 1 && this.counterFiguresBlack === 1) {
        alert("РЕМИ, Край на играта!");
        this.counterFiguresWhite = 10;
        this.counterFiguresBlack = 10;
        this.counterPointsWhite = 0;
        this.counterPointsBlack = 0;
        this.board = this.initBoard();
    }
};

BoardManager.prototype.pawn = function(x, y, d = 1) {
    const width = this.context.lineWidth;
    this.context.lineWidth = "6";
    const color = this.board[y][x].getColor();
    //var nY = color === "б" ? y - 1 : y - 1;
    if (this.board[y - d][x] === null) {
        this.movePieceArray[y - d][x] = "move";
        this.context.strokeStyle = "rgb(51, 204, 51, 0.5)";
        this.context.strokeRect(x * BoardConfig.TILE_SIZE, (y - d) * BoardConfig.TILE_SIZE, BoardConfig.TILE_SIZE, BoardConfig.TILE_SIZE);
    }
    if (
        x > 0 &&
        this.board[y - d][x - 1] !== null &&
        this.board[y - d][x - 1].getColor() !== color
    ) {
        this.movePieceArray[y - d][x - 1] = "attack";
        this.checkMovesKingArray[y - d][x - 1] = "attack";
        this.context.strokeStyle = "rgb(204, 51, 0, 0.5)";
        this.context.strokeRect(
            (x - 1) * BoardConfig.TILE_SIZE,
            (y - d) * BoardConfig.TILE_SIZE,
            BoardConfig.TILE_SIZE,
            BoardConfig.TILE_SIZE
        );
    }
    if (
        x < 9 &&
        this.board[y - d][x + 1] !== null &&
        this.board[y - d][x + 1].getColor() !== color
    ) {
        this.movePieceArray[y - d][x + 1] = "attack";
        this.checkMovesKingArray[y - d][x + 1] = "attack";
        this.context.strokeStyle = "rgb(204, 51, 0, 0.5)";
        this.context.strokeRect(
            (x + 1) * BoardConfig.TILE_SIZE,
            (y - d) * BoardConfig.TILE_SIZE,
            BoardConfig.TILE_SIZE,
            BoardConfig.TILE_SIZE
        );
    }

    this.context.lineWidth = width;
};

BoardManager.prototype.rook = function () {
    this.checkMove(0, -1);
    this.checkMove(0, 1);
    this.checkMove(-1, 0);
    this.checkMove(1, 0);
};

BoardManager.prototype.bishop = function () {
    this.checkMove(1, 1);
    this.checkMove(1, -1);
    this.checkMove(-1, -1);
    this.checkMove(-1, 1);
};

BoardManager.prototype.queen = function () {
    this.checkMove(1, 1);
    this.checkMove(1, -1);
    this.checkMove(-1, -1);
    this.checkMove(-1, 1);
    this.checkMove(0, -1);
    this.checkMove(0, 1);
    this.checkMove(-1, 0);
    this.checkMove(1, 0);
};

BoardManager.prototype.king = function () {
    this.checkMove(1, 1, 1);
    this.checkMove(1, -1, 1);
    this.checkMove(-1, -1, 1);
    this.checkMove(-1, 1, 1);
    this.checkMove(0, -1, 1);
    this.checkMove(0, 1, 1);
    this.checkMove(-1, 0, 1);
    this.checkMove(1, 0, 1);
};

BoardManager.prototype.knight = function () {
    this.checkMove(2, 1, 1);
    this.checkMove(2, -1, 1);
    this.checkMove(-2, 1, 1);
    this.checkMove(-2, -1, 1);
    this.checkMove(1, 2, 1);
    this.checkMove(1, -2, 1);
    this.checkMove(-1, 2, 1);
    this.checkMove(-1, -2, 1);
};

BoardManager.prototype.checkMove = function(stepX, stepY, count = 10, colorAttack, colorMove) {
    const w = this.context.lineWidth;
    this.context.lineWidth = "6";

    var x = this.selectedPiece.sx;
    var y = this.selectedPiece.sy;

    const color = this.board[y][x].getColor();

    while (count-- > 0) {
        x = x + stepX;
        y = y + stepY;
        if (x < 0 || x > 9 || y < 0 || y > 9) {
            break;
        }
        if (this.board[y][x] !== null) {
            if (this.board[y][x].getColor() !== color) {
                this.movePieceArray[y][x] = "attack";
                this.context.strokeStyle = "rgb(204, 51, 0, 0.5)";
                this.context.strokeRect(x * BoardConfig.TILE_SIZE, y * BoardConfig.TILE_SIZE, BoardConfig.TILE_SIZE, BoardConfig.TILE_SIZE);
            }
            break;
        }
        this.movePieceArray[y][x] = "move";
        this.context.strokeStyle = "rgb(51, 204, 51, 0.5)";
        this.context.strokeRect(x * BoardConfig.TILE_SIZE, y * BoardConfig.TILE_SIZE, BoardConfig.TILE_SIZE, BoardConfig.TILE_SIZE);
    }
    this.context.lineWidth = w;
};

BoardManager.prototype.showSelected = function() {
    if (this.selectedPiece !== null) {
        this.context.fillStyle = "rgb(255, 255, 0, 0.5)";
        this.context.fillRect(
            this.selectedPiece.sx * BoardConfig.TILE_SIZE,
            this.selectedPiece.sy * BoardConfig.TILE_SIZE,
            BoardConfig.TILE_SIZE,
            BoardConfig.TILE_SIZE
        );
    }
};

BoardManager.prototype.drawBoard = function () {
    for (var x = 0; x < this.boardSize; x++) {
        for (var y = 0; y < this.boardSize; y++) {
            this.context.fillStyle = (x + y) % 2 === 0 ? "#d1a77a" : "#ebd8c7";
            this.context.fillRect(x * BoardConfig.TILE_SIZE, y * BoardConfig.TILE_SIZE, BoardConfig.TILE_SIZE, BoardConfig.TILE_SIZE);
        }
    }
};