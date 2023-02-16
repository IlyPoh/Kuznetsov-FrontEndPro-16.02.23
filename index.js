import Grid from './js/grid.js';
import { DIRECTION as D } from './js/helpers.js';

class Snake extends Grid {
    static snakeCellCssClass = 'snake-cell';
    static snakeCssClass = 'snake';
    static snakeHeadCssClass = 'snake-head';
    static snakeBodyCssClass = 'snake-body';
    static gridContainerSelector = '#snake-container';

    #snake = [];
    #process = null;
    #speed = 0;
    #startBtn = this.find('#snake-start-game');
    #endBtn = this.find('#snake-end-game');
    #form = this.find('#snake-controls-form');
    #messageContainer =  this.find('#snake-message');
    #scoreContainer =  this.find('#snake-score');


    constructor({boxSize, gridCount}) {
        super({
            boxSize, 
            gridCount,
            gridCellCssClass: Snake.snakeCellCssClass,
            gridContainerSelector: Snake.gridContainerSelector,
        });
        this.direction = D.LEFT;

        this.#init();
    }


    #init() {
        this.#startBtn.addEventListener('click', () => {
            this.#start();
        });

        this.#endBtn.addEventListener('click', () => {
            this.#endGame();
        });

        document.addEventListener('keydown', (event) => {
            this.#updateDirection(event);
        })
    }

    #start() {
        let middleCell = Math.floor(this.gridCount) / 2;
        this.#snake = this.#buildSnake(middleCell, middleCell);
        this.#speed = +this.#form.speed.value;
        // #generateFood / place img in a random cell  Need to make sure that random cell is not body of snake

        // endBtn = dispay.block
        // startBtn = dispay.none
        // messageContainer.innerHTML = "Welcome to Snake!"

        this.#process = setInterval(()=>{

            let { cell, row } = this.#snake[0];
            // let { cell, row } = this#noWallMode() - check if cell === 0 or cell === gridCount then cell = vise versa value  

            let snakePartToShift = null;

            switch(this.direction) {
                case D.LEFT: {
                    snakePartToShift = {
                        cell: cell - 1,
                        row,
                    };
                }; break;
                case D.RIGHT: {
                    snakePartToShift = {
                        cell: cell + 1,
                        row,
                    };
                }; break;
                case D.UP: {
                    snakePartToShift = {
                        cell,
                        row: row - 1,
                    };
                }; break;
                case D.DOWN: {
                    snakePartToShift = {
                        cell,
                        row: row + 1,
                    };
                }; break;
            };

            this.#snake.unshift(snakePartToShift);
            
            this.#clear();
            this.#update();
        }, this.#speed);

      
    }

    #clear() {
        let cells = this.find(`.${Snake.snakeCssClass}`);

        cells.forEach( cell => {
            cell.className = Snake.snakeCellCssClass;
        })
    }

    #update() {
        // #checkIfSnakeHasEaten() 
        // if snake ate apple then add + 1 to score, delete apple from the cell, add  +1 {cell, row}
        // after the snake ate the food we should re-generate random cell and add new one (so you may invoke this.#generateFood)


        // checkOnTailCrash - if a head bump into the tail. You have to end game calling 'endGame()';

        this.#snake.pop();

        for( let [index, snakePart] of this.#snake.entries()) {
            let cellElement = this.#findByCoords(snakePart);
            
            if(index === 0) {
                cellElement.classList.add(Snake.snakeHeadCssClass, Snake.snakeCssClass);

                continue;
            }

            cellElement.classList.add(Snake.snakeBodyCssClass, Snake.snakeCssClass);
        }
    }

    #updateDirection(event) {
        let key = event.key;

        if(key === 'ArrowLeft' && this.direction != D.RIGHT) {
            this.direction = D.LEFT;
        } else if(key === 'ArrowUp' && this.direction != D.DOWN) {
            this.direction = D.UP;
        } else if(key === 'ArrowRight' && this.direction != D.LEFT) {
            this.direction = D.RIGHT;
        } else if(key === 'ArrowDown' && this.direction != D.UP) {
            this.direction = D.DOWN;
        }
    }

    #findByCoords({row, cell}) {
        return this.find(`[data-cell="${cell}"][data-row="${row}"]`, this.gridContainer)
    }

    #buildSnake(startCell, startRow, size = 5) {
        return new Array(size).fill(null).map((_value, index) => {
            debugger;
            return { cell: startCell + index, row: startRow };
        })
    }

    #endGame() {
        clearInterval(this.#process);
        // show Game over message 
        // reset score 
        // change button view 
        // clear workfield - get rid of all snake parts 
        // ...
    }
}

new Snake({
    boxSize: 30,
    gridCount: 16,
})