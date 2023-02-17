export class Manipulator {
    find(selector, container = document) {
        let collections = container.querySelectorAll(selector);

        return collections.length === 1 ? collections[0] : collections;
    }
}

export const DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down',
};

export const RANDOMIZER = (max, min = 0) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;    
}

export const WORDS = {
    BLOCK: 'block',
    NONE: 'none',
    PAUSE: 'Pause',
    UNPAUSE: 'Unpause',
    GAMEPAUSED: 'Game Paused',
    WELCOME: 'Welcome to Snake !',
    GAMEOVER: 'Game Over',
    APPLE: 'apple',
}