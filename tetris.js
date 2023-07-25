//HTML内の全てのdiv要素を取得して、配列に変換
let squares = Array.from(document.querySelectorAll('.grid div'));

//ゲームボードの定義
const gameBoard = document.getElementById('game-board');
const board = [];
const boardWidth = 10;  // 10 columns
const boardHeight = 20; // 20 rows

// ゲームボードの描画
for(let y = 0; y < boardHeight; y++) {
    let row = [];
    for(let x = 0; x < boardWidth; x++) {
        const cell = document.createElement('div');
        cell.style.width = '30px';
        cell.style.height = '30px';
        cell.style.border = '1px solid white';
        cell.style.boxSizing = 'border-box';
        cell.style.float = 'left';
        gameBoard.appendChild(cell);
        row.push(cell);
    }
    board.push(row);
}

//ブロックの定義
const tetrominoes = [
    // Iテトリミノ
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],

    // Jテトリミノ
    [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],

    // Lテトリミノ
    [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ],

    // Oテトリミノ
    [
        [4, 4],
        [4, 4]
    ],

    // Sテトリミノ
    [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ],

    // Tテトリミノ
    [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],

    // Zテトリミノ
    [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
    ]
];

//テトリミノの初期座標を定義
let currentPosition = {x: 4, y: 0};
let currentRotation = 0;

let random = Math.floor(Math.random()*tetrominoes.length);
let current = tetrominoes[random];

//ゲームボードにテトリミノを描写
function draw() {
    current.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                // 開始位置（currentPosition）を含めた座標にブロックを描画
                board[currentPosition.y + y][currentPosition.x + x].classList.add('block');
            }
        });
    });
}

draw();

//ゲームボードからテトリミノを削除
function erase() {
    current.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                board[currentPosition.y + y][currentPosition.x + x].classList.remove('block');
            }
        });
    });
}

//テトリミノを落下する処理
function moveDown() {
    
    currentPosition.y++;
    draw();
}

// 1000ミリ秒ごとにテトリミノを下に移動
setInterval(moveDown, 1000); 

//衝突判定
function checkForCollision() {
    for(let y = 0; y < current.length; y++) {
        for(let x = 0; x < current[y].length; x++) {
            // ブロックが存在しない部分はスキップ
            if(current[y][x] === 0) {
                continue;
            }

            // 新しいブロックの位置
            let newX = currentPosition.x + x;
            let newY = currentPosition.y + y;

            // 新しいブロックがゲームボードの底に触れているかチェック
            if(newY >= boardHeight) {
                return true;
            }

            // 新しいブロックの位置に他のブロックが存在しているかチェック
            if(board[newY][newX] !== undefined && board[newY][newX].classList.contains('fixed')) {
                return true;
            }
        }
    }
    return false;
}


function moveDown() {
    // 現在のブロックを消去
    undraw();

    // ブロックの位置を更新
    currentPosition.y++;

    // 衝突判定
    if(checkForCollision()) {
        // 衝突があった場合はブロックの位置を一つ戻し、固定する
        currentPosition.y--;
        fixBlock();

        // 新しいブロックを生成
        currentPosition = {x: 4, y: 0};
        random = Math.floor(Math.random() * tetrominoes.length);
        current = tetrominoes[random];

        // 新しいブロックを描画
        draw();
    } else {
        // 衝突がなければブロックを描画
        draw();
    }
}


//ブロックを固定
function fixBlock() {
    current.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                // ブロックを固定
                board[currentPosition.y + y][currentPosition.x + x].classList.add('fixed');
            }
        });
    });
}



// 1000ミリ秒ごとにテトリミノを下に移動
setInterval(moveDown, 1000); 

//衝突判定
function checkForCollision() {
    for(let y = 0; y < current.length; y++) {
        for(let x = 0; x < current[y].length; x++) {
            // ブロックが存在しない部分はスキップ
            if(current[y][x] === 0) {
                continue;
            }

            // 新しいブロックの位置
            let newX = currentPosition.x + x;
            let newY = currentPosition.y + y;

            // 新しいブロックがゲームボードの底に触れているかチェック
            if(newY >= boardHeight) {
                return true;
            }

            // 新しいブロックの位置に他のブロックが存在しているかチェック
            if(board[newY][newX] !== undefined && board[newY][newX].classList.contains('fixed')) {
                return true;
            }
        }
    }
    return false;
}


function moveDown() {
    // 現在のブロックを消去
    erase();

    // ブロックの位置を更新
    currentPosition.y++;

    // 衝突判定
    if(checkForCollision()) {
        // 衝突があった場合はブロックの位置を一つ戻し、固定する
        currentPosition.y--;
        fixBlock();

        // 新しいブロックを生成
        currentPosition = {x: 4, y: 0};
        random = Math.floor(Math.random() * tetrominoes.length);
        current = tetrominoes[random];

        // 新しいブロックを描画
        draw();
    } else {
        // 衝突がなければブロックを描画
        draw();
    }
}


//ブロックを固定
function fixBlock() {
    current.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                // ブロックを固定
                board[currentPosition.y + y][currentPosition.x + x].classList.add('fixed');
            }
        });
    });
}

