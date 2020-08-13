import {Point} from './point'

export class Enviroment{
    boardDim: [number, number] = [10, 10];
    snake: Point[] = [];
    apple: Point;

    constructor(boardSize: number = 10){
        this.snake.push(new Point(0, 0));
        this.snake.push(new Point(1, 0));
        this.apple = new Point(this.boardDim[0], this.boardDim[1])
    }

    getSnake(){
        return this.snake;
    }
}