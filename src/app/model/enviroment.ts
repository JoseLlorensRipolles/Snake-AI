import { Point } from './point'
import { range } from 'rxjs';

export class Enviroment {
    boardDim: Point = new Point(10, 10);
    snake: Point[] = [];
    apple: Point;

    constructor() {
        this.snake.push(new Point(1, 0));
        this.snake.push(new Point(0, 0));
        this.apple = new Point(this.boardDim.x - 1, this.boardDim.y - 1)
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
        console.log(availablePoints);
        return availablePoints[Math.floor(Math.random() * availablePoints.length)]
    }
}