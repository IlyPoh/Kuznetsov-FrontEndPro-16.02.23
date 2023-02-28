import Grid from './js/grid.js';
import { DIRECTION as D, WORDS as W , RANDOMIZER} from './js/helpers.js';

class Snake extends Grid {
    static сellCssClass = 'cell';
    static snakeCssClass = 'snake';
    static snakeHeadCssClass = 'snake-head';
    static snakeBodyCssClass = 'snake-body';
    static gridContainerSelector = '#snake-container';
    static apple = 'apple';

    #snake = [];
    #apples = [];
    #working = null;
    #generating = null;
    #speed = 0;
    #appleSpeed = 0;
    #score = 0;
    #paused = true;
    #running = false;
    #startBtn = this.find('#snake-start-game');
    #pauseBtn = this.find('#snake-pause-game');
    #endBtn = this.find('#snake-end-game');
    #form = this.find('#snake-controls-form');
    #messageContainer =  this.find('#snake-message');
    #scoreContainer =  this.find('#snake-score');


    constructor({boxSize, gridCount}) {
        super({
            boxSize, 
            gridCount,
            gridCellCssClass: Snake.сellCssClass,
            gridContainerSelector: Snake.gridContainerSelector,
        });
        this.direction = D.LEFT;

        this.#init();
    }


    #init() {
        this.#startBtn.addEventListener('click', () => {
            this.#start();
        });

        this.#pauseBtn.addEventListener('click', () => {
            this.#pauseGame();
        });
        
        this.#endBtn.addEventListener('click', () => {
            this.#endGame();
        });

        document.addEventListener('keydown', (event) => {
            this.#updateDirection(event);
        })

        this.#pauseBtn.style.display = W.NONE;
        this.#endBtn.style.display = W.NONE;
    }

    #start() {
        let middleCell = Math.floor(this.gridCount) / 2;
        this.#snake = this.#buildSnake(middleCell, middleCell);
        this.#speed = +this.#form.speed.value;
        this.#appleSpeed = this.#speed * 20;
        this.#paused = false;
        this.#running = true;
        this.direction = D.LEFT;

        this.#working = setInterval(this.#process, this.#speed);
        this.#generating = setInterval(this.#generateFood, this.#appleSpeed)
        this.#generateFood();
        this.#checkRunning();
    }
    #process = () => {
        let { cell, row } = this.#noWallMode();

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
        this.#checkRunning();
    }

    #noWallMode = () => {        
        let { cell, row } = this.#snake[0];
        if (cell === 0 && this.direction === D.LEFT) {
            return {cell: this.gridCount, row}
        } else if (cell === this.gridCount - 1 && this.direction === D.RIGHT) {
            return {cell: -1, row}
        }
        if (row === 0 && this.direction === D.UP) {
            return {row: this.gridCount, cell}
        } else if (row === this.gridCount - 1 && this.direction === D.DOWN) {
            return {row: -1, cell}
        }
        return {cell, row}
    }

    #checkRunning() {
        if (this.#running) {
            this.#startBtn.style.display = W.NONE;
            this.#pauseBtn.style.display = W.BLOCK;
            this.#pauseBtn.innerHTML = W.PAUSE;
            this.#endBtn.style.display = W.BLOCK;
            this.#messageContainer.innerHTML = W.WELCOME;
        } else if(!this.#running && this.#paused) {
            this.#pauseBtn.innerHTML = W.UNPAUSE;
            this.#messageContainer.innerHTML = W.GAMEPAUSED;
        } else {
            this.#messageContainer.innerHTML = W.GAMEOVER;
            this.#startBtn.style.display = W.BLOCK;
            this.#pauseBtn.style.display = W.NONE;
            this.#endBtn.style.display = W.NONE;
        }
    }

    #generateFood = () => {
        let randomizedCell = {cell: RANDOMIZER(this.gridCount - 1), row: RANDOMIZER(this.gridCount - 1)}
        let randomizedElement = this.#findByCoords(randomizedCell);
        for (let i = 0; i < this.#snake.length; i++) {
            if (this.#comparingCoords(this.#snake[i], randomizedCell)) {
                this.#generateFood();
                return;
            }
        }
        randomizedElement.classList.add(W.APPLE);
        this.#apples.push(randomizedCell);
    }

    #clear() {
        let cells = this.find(`.${Snake.snakeCssClass}`);

        cells.forEach( cell => {
            cell.className = Snake.сellCssClass;
        });
    }
    
    #clearApple() {
        let cells = document.querySelectorAll(`.${Snake.apple}`)

        cells.forEach( cell => {
            cell.className = Snake.сellCssClass;
        });
        this.#apples = [];
    }

    #update() {
        this.#checkOnTailCrash();
        this.#checkIfSnakeHasEaten();

        this.#snake.pop();

        for(let [index, snakePart] of this.#snake.entries()) {
            let cellElement = this.#findByCoords(snakePart);
            
            if(index === 0) {
                cellElement.classList.add(Snake.snakeHeadCssClass, Snake.snakeCssClass);

                continue;
            }

            cellElement.classList.add(Snake.snakeBodyCssClass, Snake.snakeCssClass);
        }
    }
    #checkIfSnakeHasEaten () {
        for (let i = 0; i < this.#apples.length; i++) {
            if (this.#comparingCoords(this.#snake[0], this.#apples[i])) {
                this.#snake.length++
                this.#score++
                this.#scoreContainer.querySelector('b').innerHTML = this.#score
                this.#apples.splice(i, 1)
            }            
        }
        return this.#snake
    }
    #checkOnTailCrash() {
        for (let j = 1; j < this.#snake.length; j++) {
            if (this.#comparingCoords(this.#snake[0], this.#snake[j])) {
                this.#endGame()
            }
        }
        return this.#snake
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
            return { cell: startCell + index, row: startRow };
        })
    }

    #comparingCoords(firstObject, secondObject) {
        return firstObject.cell === secondObject.cell && firstObject.row === secondObject.row;
    }
    
    #pauseGame() {
        if (!this.#paused) {
            clearInterval(this.#working)
            clearInterval(this.#generating)
            this.#paused = true;
            this.#running = false;
            this.#checkRunning();
        } else {
            this.#working = setInterval(this.#process, this.#speed)
            this.#generating = setInterval(this.#generateFood, this.#appleSpeed)
            this.#paused = false;
            this.#running = true;
        }
    }

    #endGame() {
        clearInterval(this.#working);
        clearInterval(this.#generating);
        this.#score = 0;
        this.#paused = false;
        this.#running = false;
        this.#scoreContainer.querySelector('b').innerHTML = this.#score;
        this.#clear();
        this.#clearApple();
        this.#checkRunning();
    }
}

new Snake({
    boxSize: 30,
    gridCount: 16,
})