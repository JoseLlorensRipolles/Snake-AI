import { Point } from './point'
import { range } from 'rxjs';

export class Enviroment {
    boardDim: Point = new Point(10, 10);
    snake: Point[];
    apple: Point;

    constructor() {
        this.reset();
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
            } case "LEFT": {
                move = [-1, 0];
                break;
            }
        }

        let tail: Point = this.snake.pop();
        let head: Point = this.snake[0];

        this.snake.unshift(new Point(head.x + move[0],
            head.y + move[1]));

        if (this.snake[0].x === this.apple.x && this.snake[0].y === this.apple.y) {
            this.snake.push(tail)
            this.apple = this.newApplePosition();
            return 1;
        } else {
            if (this.isTerminalState()) {
                return -1;
            }else {
                return 0;
            }
        }
    }

    newApplePosition(): Point {
        let allPoints: Array<Point> = []
        for (let i = 0; i < this.boardDim.x; i++) {
            for (let j = 0; j < this.boardDim.y; j++) {
                allPoints.push(new Point(i, j))
            }
        }

        let availablePoints: Array<Point> = []
        for (let point of allPoints) {
            let isSnakePoint =
                this.snake.some(snakePoint => {
                    return point.x === snakePoint.x && point.y === snakePoint.y;
                });

            if (!isSnakePoint) {
                availablePoints.push(point);
            }
        }
        return availablePoints[Math.floor(Math.random() * availablePoints.length)]
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
        this.snake.push(new Point(1, 0));
        this.snake.push(new Point(0, 0));
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

        return [dangerUp, dangerDown, dangerRight, dangerLeft, appleUp, appleDown, appleRight, appleLeft];
    }
}