//HTML内の全てのdiv要素を取得して、配列に変換
let squares = Array.from(document.querySelectorAll('.grid div'));

//ゲームボードの定義
const gameBoard = document.getElementById('game-board');
let   board = [];
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
        //消滅のアニメーションが終わったら自動でクラスを消去
        cell.addEventListener("animationend", (e) =>{
            e.target.classList.remove("blink");
        });
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
            if (value !== 0 ) {
                // 開始位置（currentPosition）を含めた座標にブロックを描画
                board[currentPosition.y + y][currentPosition.x + x].classList.add('block');
            }
            
        });
    });
}



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

//衝突判定
function canBlockMove() {
    for(let y = 0; y < current.length; y++) {
        for(let x = 0; x < current[y].length; x++) {
            // ブロックが存在しない部分はスキップ
            if(current[y][x] === 0) {
                continue;
            }

            // 新しいブロックの位置
            let newX = currentPosition.x + x;
            let newY = currentPosition.y + y;
            
            //ブロックがステージの横端を超えてしまったかチェック
            if(newX < 0 || newX >= boardWidth){
                return true;
            }

            // 新しいブロックがゲームボードの底に触れているかチェック
            if(newY >= boardHeight) {
                return true;
            }

            // 新しいブロックの位置に他のブロックが存在しているかチェック
            if(board[newY][newX].classList.contains('fixed')) {
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
    if(canBlockMove()) {
        // 衝突があった場合はブロックの位置を一つ戻し、固定する
        currentPosition.y--;
        fixBlock();
        deleteFixedLineBlocks();

        // 新しいブロックを生成
        currentPosition = {x: 4, y: 0};
        random = Math.floor(Math.random() * tetrominoes.length);
        current = tetrominoes[random];


        // 新しいブロックを描画
        draw();

        // ゲームオーバー判定
        if (isGameOver()) {
            alert("Game Over!");
            return; // ゲームオーバーの場合、処理を終了
        }
    } else {
        // 衝突がなければブロックを描画
        draw();
    }
    if(canBlockMove()){
        alert("over");
        return 1
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


function deleteFixedLineBlocks(){
    tmpBoard = board;

    deletedLineHeights = []//削除された列の番号を記録する
    let IsThereLine = false;
    for(let height = boardHeight - 1; height >= 0; height--) {
        //console.log(IsThereLine);
        //console.log(height);
        IsThereLine = false;
        IsThereLine = tmpBoard[height].every((boardElement) => {return boardElement.classList.contains('fixed');});
        //lineができてたとき
        if(IsThereLine){
            //列消去時のアニメーション付加
            tmpBoard[height].forEach((boardElement) => {
                boardElement.classList.remove('fixed');
                boardElement.classList.add('blink');
            });
            deletedLineHeights.push(height);
            updateScore(10);
        }
    }

    //一旦ラインを消した後を描画;

    let numDown = 0;
    //console.log(deletedLineHeight);
    
    for(let height = boardHeight - 1; height >= 0; height--) {

        numDown = 0;//ダルマ落とし的に下に移動させる数
        deletedLineHeights.forEach((lineHeight) => {if(height < lineHeight){numDown++;}});
        //console.log(`line height ${numDown}`);
        if(numDown > 0){
            tmpBoard[height].forEach((boardElement, index) => {
                if(boardElement.classList.contains("fixed") && !(tmpBoard[height + numDown][index].classList.contains("fixed"))){
                    tmpBoard[height + numDown][index].classList.add("fixed");
                }
                else if(!(boardElement.classList.contains("fixed")) && tmpBoard[height + numDown][index].classList.contains("fixed")){
                    tmpBoard[height + numDown][index].classList.remove("fixed");
                }
                boardElement.classList.remove("fixed");    
            });
        
        }
    }

}


function  rotateBlock_clockwise() {
    //右時計回り
    const rotatedBlock = [];
    const rows = current.length;
    const cols = current[0].length;
                
    for (let j = 0; j < cols; j++) {
        const newRow = [];
        for (let i = rows - 1; i >= 0; i--) {
                newRow.push(current[i][j]);
            }
            rotatedBlock.push(newRow);
        }

    erase();

    tmp = current;
    current = rotatedBlock;
    // 衝突判定
    if(canBlockMove()) {
        // 衝突があった場合は回転取り消し
        current = tmp;
    }
    draw();
}


function moveRight() {
    // 現在のブロックを消去
    erase();

    // ブロックの位置を更新
    currentPosition.x++;

    // 衝突判定
    if(canBlockMove()) {
        // 衝突があった場合はブロックの位置を一つ戻し、固定する
        currentPosition.x--;
        // 新しいブロックを描画
        draw();
    } else {
        // 衝突がなければブロックを描画
        draw();
    }
}

function moveLeft() {
    // 現在のブロックを消去
    erase();

    // ブロックの位置を更新
    currentPosition.x--;

    // 衝突判定
    if(canBlockMove()) {
        // 衝突があった場合はブロックの位置を一つ戻し、固定する
        currentPosition.x++;
        // 新しいブロックを描画
        draw();
    } else {
        // 衝突がなければブロックを描画
        draw();
    }
}

// 1000ミリ秒ごとにテトリミノを下に移動
let gameInterval = setInterval(moveDown, 1000);

function isGameOver(){
    current.forEach((row, y) => {
        row.forEach((value, x) => {
            //開始位置にfixedがないならok
            //fixedとかぶったときは終了
            //console.log(value, board[currentPosition.y + y][currentPosition.x + x].classList.contains('fixed'))
            //console.log((value != 0) && (board[currentPosition.y + y][currentPosition.x + x].classList.contains('fixed')))
            console.log('value:', value);
            if((value != 0) && (board[currentPosition.y + y][currentPosition.x + x].classList.contains('fixed'))){
                //game 終わり
                //alert("over");
                console.log('Game Over condition met!'); 
                sendScore(111, score);
                clearInterval(gameInterval);
                return;
            }
        });
    });
    //継続
    return;
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
      // 上矢印キーが押された場合の処理
        rotateBlock_clockwise();
    } else if (event.key === 'ArrowDown') {
      // 下矢印キーが押された場合の処理
        moveDown();
    } else if (event.key === 'ArrowLeft') {
      // 左矢印キーが押された場合の処理
        moveLeft();
    } else if (event.key === 'ArrowRight') {
      // 右矢印キーが押された場合の処理
        moveRight();
    }
  });

//　スコアを保持
let score = 0;
// スコアを表示するためのHTML要素を取得
const scoreDisplay = document.getElementById('score');
// スコアを更新して表示するための関数
function updateScore(value){
    score += value;
    scoreDisplay.textContent = score;
}

draw();
 

//スコア自動送信
function sendScore(userId, score) {
    var data = {
      user_id: userId,
      score: score
    };

    console.log('Sending score:', data); //
  
    fetch('http://127.0.0.1:8000/submit_score', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Score submitted successfully:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// 週間ランキング取得
function getWeeklyRanking() {
    fetch('/weekly_ranking')
      .then(response => response.json())
      .then(data => {
        // ランキングデータを処理
        console.log('Weekly ranking:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}

