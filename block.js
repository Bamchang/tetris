
WALL = 1
BLK = 2

class Block{
    
    constructor( block ) {
        this.block = block;
    }
    
            
            
    rotateBlock_clockwise() {
        //右時計回り
        const rotatedBlock = [];
        const rows = this.block.length;
        const cols = this.block[0].length;
                    
        for (let j = 0; j < cols; j++) {
            const newRow = [];
            for (let i = rows - 1; i >= 0; i--) {
                    newRow.push(this.block[i][j]);
                }
                rotatedBlock.push(newRow);
            }
                    
        this.block = rotatedBlock;
    }

    rotateBlock_anticlockwise(block) {
        //反時計回り
        const rotatedBlock = [];
        const rows = this.block.length;
        const cols = this.block[0].length;
                    
        for (let j = cols - 1;j >= 0; j--) {
            const newRow = [];
            for (let i = 0; i < rows; i++) {
                    newRow.push(this.block[i][j]);
                }
                rotatedBlock.push(newRow);
            }
                    
        this.block = rotatedBlock;
    }



}

function makeRandomBlock(){
    blocks = [
    [//I
        [0, 0, 0, 0],
        [BLK, BLK, BLK, BLK],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [//J
        [BLK, 0, 0, 0],
        [BLK, BLK, BLK, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [//L
        [0, 0, BLK, 0],
        [BLK, BLK, BLK, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [//o
        [BLK, BLK, 0, 0],
        [BLK, BLK, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [//Z
        [0, BLK, BLK, 0],
        [BLK, BLK, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [//T
        [0, BLK, 0, 0],
        [BLK, BLK, BLK, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [//S
        [BLK, BLK, 0, 0],
        [0, BLK, BLK, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
]

const random_idx = randomNum = Math.floor(Math.random() * blocks.length);

return new Block(blocks[random_idx])
}
/*test
currentBlock = makeRandomBlock()
console.log(currentBlock.block)
currentBlock.rotateBlock_anticlockwise()
console.log(currentBlock.block)
currentBlock.rotateBlock_clockwise()
console.log(currentBlock.block)
*/
