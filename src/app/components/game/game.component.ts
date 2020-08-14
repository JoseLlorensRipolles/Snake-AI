import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Point } from '../../model/point';
import { Enviroment } from '../../model/enviroment';


enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  W_KEY = 87,
  S_KEY = 83,
  A_KEY = 65,
  D_KEY = 68
}


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {

  @ViewChild('gameCanvas', { static: true })
  gameCanvas: ElementRef<HTMLCanvasElement>



  ctx: CanvasRenderingContext2D;
  enviroment: Enviroment;
  direction: string;

  constructor() { }

  ngOnInit(): void {

    this.ctx = this.gameCanvas.nativeElement.getContext("2d");
    this.ctx.scale(10, 10);
    this.enviroment = new Enviroment();
    this.direction = "RIGHT"

    this.drawGame()

    this.gameLoop();
  }

  gameLoop() {
    this.enviroment.takeAction(this.direction);
    
    this.drawGame();
    setTimeout(() => {
      this.gameLoop();
    }, 200)
  }

  drawGame() {
    this.ctx.clearRect(0, 0, this.enviroment.boardDim.x, this.enviroment.boardDim.y);
    this.drawSnake();
    this.drawApple();
  }

  drawSnake() {
    this.ctx.fillStyle = "#000000";
    this.enviroment.snake.forEach(element => {
      this.ctx.fillRect(
        element.x,
        this.enviroment.boardDim.y - 1 - element.y,
        1,
        1)
    })

  }

  drawApple() {
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillRect(
      this.enviroment.apple.x,
      this.enviroment.boardDim.y - 1 - this.enviroment.apple.y,
      1,
      1);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.keyCode) {

      case KEY_CODE.LEFT_ARROW:
      case KEY_CODE.A_KEY:
        this.direction = "LEFT";
        break;

      case KEY_CODE.RIGHT_ARROW:
      case KEY_CODE.D_KEY:
        this.direction = "RIGHT";
        break;

      case KEY_CODE.UP_ARROW:
      case KEY_CODE.W_KEY:
        this.direction = "UP";
        break;

      case KEY_CODE.DOWN_ARROW:
      case KEY_CODE.S_KEY:
        this.direction = "DOWN";
        break;

    }
  }
}

