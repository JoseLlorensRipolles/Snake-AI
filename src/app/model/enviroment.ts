import { Point } from './point'
import { range } from 'rxjs';
import * as tf from '@tensorflow/tfjs';
import { NumericDataType } from '@tensorflow/tfjs';

export class Enviroment {
    boardDim: Point;
    snake: Point[];
    apple: Point;

    constructor(heigh: number, width: number) {
        this.boardDim = new Point(heigh, width);
        this.reset();
    }

    takeAction(action: string) {

        let move = this.getMoveFromAction(action);

        this.moveSnake(move);

        if (this.snakeIsEatingApple()) {
            this.apple = this.newApplePosition();
            return 1;
        }

        if (this.isTerminalState()) {
            return -1;
        }

        return 0;
    }

    private moveSnake(move: [number, number]) {
        let head: Point = this.snake[0];
        this.snake.unshift(new Point(head.x + move[0],
            head.y + move[1]));

        if (!this.snakeIsEatingApple()) {
            this.snake.pop();
        }
    }

    private getMoveFromAction(action: string) {
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
            } case "LEFT": {
                move = [-1, 0];
                break;
            }
        }
        return move;
    }

    private snakeIsEatingApple() {
        return this.snake[0].x === this.apple.x && this.snake[0].y === this.apple.y;
    }

    newApplePosition(): Point {
        let freePointsOnBoard: Array<Point> = this.getFreePointsOnBoard();
        return this.randomChoice(freePointsOnBoard)
    }

    private randomChoice(collection: any[]): any {
        return collection[Math.floor(Math.random() * collection.length)];
    }

    private getFreePointsOnBoard() {
        return this.getPointsOnBoard().filter(point => !this.isPointUsedBySnake(point))
    }

    private isPointUsedBySnake(point: Point) {
        return this.snake.some(snakePoint => {
            return point.x === snakePoint.x && point.y === snakePoint.y;
        });
    }

    private getPointsOnBoard() {
        let allPoints: Array<Point> = [];
        for (let i = 0; i < this.boardDim.x; i++) {
            for (let j = 0; j < this.boardDim.y; j++) {
                allPoints.push(new Point(i, j));
            }
        }
        return allPoints;
    }

    isTerminalState(): boolean {
        let head = this.snake.shift()
        let isTerminalState: boolean =
            head.x < 0 ||
            head.x >= this.boardDim.x ||
            head.y < 0 ||
            head.y >= this.boardDim.y ||
            this.snake.some(element => element.x === head.x && element.y === head.y);

        this.snake.unshift(head);
        return isTerminalState;
    }

    reset() {
        this.snake = [];
        this.snake.push(new Point(Math.floor(this.boardDim.x / 2), 4));
        this.snake.push(new Point(Math.floor(this.boardDim.x / 2), 3));
        this.apple = this.newApplePosition();
    }

    getState() {
        let head = this.snake[0];

        let dangerUp = head.y === this.boardDim.y - 1 || this.snake.some(snakePoint => snakePoint.x === head.x && snakePoint.y - 1 === head.y);
        let dangerDown = head.y === 0 || this.snake.some(snakePoint => snakePoint.x === head.x && snakePoint.y + 1 === head.y);
        let dangerRight = head.x === this.boardDim.x - 1 || this.snake.some(snakePoint => snakePoint.x - 1 === head.x && snakePoint.y === head.y);
        let dangerLeft = head.x === 0 || this.snake.some(snakePoint => snakePoint.x + 1 === head.x && snakePoint.y === head.y);

        let appleUp = head.y < this.apple.y;
        let appleDown = head.y > this.apple.y;
        let appleRight = head.x < this.apple.x;
        let appleLeft = head.x > this.apple.x;

        let booleanArray = [dangerUp, dangerDown, dangerRight, dangerLeft, appleUp, appleDown, appleRight, appleLeft];
        let stateArray: number[] = booleanArray.map(a => a ? 1 : 0);
        return stateArray
    }
}