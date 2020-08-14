import { Point } from './point'

export class Enviroment {
    boardDim: [number, number] = [10, 10];
    snake: Point[] = [];
    apple: Point;

    constructor(boardSize: number = 10) {
        this.snake.push(new Point(1, 0));
        this.snake.push(new Point(0, 0));
        this.apple = new Point(this.boardDim[0] - 1, this.boardDim[1] - 1)
    }

    takeAction(action: string) {

        let move: [number, number]

        switch (action) {
            case "UP": {
                move = [0, 1];
                break;
            } case "DOWN": {
                move = [0, -1];
                break;
            } case "RIGHT": {
                move = [1, 0];
                break;
            } case "LEFT":{
                move = [-1, 0];
                break;
            }
        }

        let tail: Point = this.snake.pop();
        let head: Point = this.snake[0];

        this.snake.unshift(new Point(head.x + move[0],
                                     head.y + move[1]));
    }
}