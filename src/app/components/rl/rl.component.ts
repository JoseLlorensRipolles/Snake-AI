import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SnakeRlAgentService } from 'src/app/services/rl-agent.service'
import { Enviroment } from 'src/app/model/enviroment';
import { Point } from 'src/app/model/point';

@Component({
  selector: 'app-rl',
  templateUrl: './rl.component.html',
  styleUrls: ['./rl.component.scss']
})

export class RlComponent implements OnInit {

  @ViewChild('gameCanvas', { static: true })
  gameCanvas: ElementRef<HTMLCanvasElement>

  ctx: CanvasRenderingContext2D;
  enviroment: Enviroment;
  score: number = 2;

  constructor(private snakeRLAgent: SnakeRlAgentService) { }

  ngOnInit(): void {
    this.snakeRLAgent.start();
    this.enviroment = new Enviroment();
    this.ctx = this.gameCanvas.nativeElement.getContext("2d");
    this.ctx.scale(10, 10);

    this.showLastGame();
  }

  showLastGame() {
    setTimeout(() => {    
      if (this.snakeRLAgent.getLastGameSnakesAndApples() ) {
        this.drawGame(this.snakeRLAgent.getLastGameSnakesAndApples())
      } else {
        this.showLastGame();
      }
    }, 1000)
  }

  drawGame(episodeSnakesAndActions: [Point[], Point][] ) {
    setTimeout(() => {
      if (episodeSnakesAndActions.length > 0) {
        let snakesAndActions = episodeSnakesAndActions.shift();
        let snake = snakesAndActions[0];
        this.score = snake.length;
        let apple = snakesAndActions[1];
        this.ctx.clearRect(0, 0, this.enviroment.boardDim.x, this.enviroment.boardDim.y);
        this.drawSnake(snake);
        this.drawApple(apple);
        this.drawGame(episodeSnakesAndActions);
      }else{
        this.showLastGame();
      }
    }, 50)

  }

  drawSnake(snake: Point[]) {
    this.ctx.fillStyle = "#000000";
    snake.forEach(element => {
      this.ctx.fillRect(
        element.x,
        this.enviroment.boardDim.y - 1 - element.y,
        1,
        1)
    })

  }

  drawApple(apple: Point) {
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillRect(
      apple.x,
      this.enviroment.boardDim.y - 1 - apple.y,
      1,
      1);
  }
}
