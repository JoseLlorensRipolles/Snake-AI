import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SnakeRlAgent } from 'src/app/model/snake-rl-agent'
import { Enviroment } from 'src/app/model/enviroment';
import { Point } from 'src/app/model/point';

@Component({
  selector: 'app-rl',
  templateUrl: './rl.component.html',
  styleUrls: ['./rl.component.scss']
})

export class RlComponent implements OnInit {

  HEIGHT = 15;
  WIDTH = 15;
  SCALE = 10;

  @ViewChild('gameCanvas', { static: true })
  gameCanvas: ElementRef<HTMLCanvasElement>

  ctx: CanvasRenderingContext2D;
  enviroment: Enviroment;
  score: number = 2;
  snakeRLAgent: SnakeRlAgent;

  constructor() { }

  ngOnInit(): void {
    this.snakeRLAgent = new SnakeRlAgent(this.HEIGHT, this.WIDTH);
    this.snakeRLAgent.start();
    this.enviroment = new Enviroment(this.HEIGHT, this.WIDTH);
    this.ctx = this.gameCanvas.nativeElement.getContext("2d");
    this.showLastGame();
  }

  ngAfterViewInit():void {
    this.ctx.scale(this.SCALE, this.SCALE);
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
        let apple = snakesAndActions[1];
        this.score = snake.length;
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
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
        this.HEIGHT - 1 - element.y,
        1,
        1)
    })

  }

  drawApple(apple: Point) {
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillRect(
      apple.x,
      this.HEIGHT - 1 - apple.y,
      1,
      1);
  }
}
