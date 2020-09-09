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

  HEIGHT = 15;
  WIDTH = 15;
  SCALE = 10;

  @ViewChild('gameCanvas', { static: true })
  gameCanvas: ElementRef<HTMLCanvasElement>

  @ViewChild('gameView', { static: true })
  gameView: ElementRef<HTMLCanvasElement>

  ctx: CanvasRenderingContext2D;
  enviroment: Enviroment;
  direction: string;
  isTerminalState: boolean = false;
  lastMovement: string;
  isTouchScreen: boolean;

  constructor() { }

  ngOnInit(): void {
    this.gameView.nativeElement.addEventListener("touchstart", e => this.touchMove(e))
    this.gameView.nativeElement.addEventListener("touchmove", e => this.touchMove(e))
    this.ctx = this.gameCanvas.nativeElement.getContext("2d");
    this.isTouchScreen = this.checkIfTouchScreen();
    this.start();
  }

  checkIfTouchScreen(): boolean {
    let hasTouchScreen = false;
    if ("maxTouchPoints" in navigator) {
      hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
      hasTouchScreen = window.navigator.msMaxTouchPoints > 0;
    } else {
      let mQ = window.matchMedia && matchMedia("(pointer:coarse)");
      if (mQ && mQ.media === "(pointer:coarse)") {
        hasTouchScreen = !!mQ.matches;
      } else if ('orientation' in window) {
        hasTouchScreen = true; // deprecated, but good fallback
      } else {
        // Only as a last resort, fall back to user agent sniffing
        let UA = window.navigator.userAgent;
        hasTouchScreen = (
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
          /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
        );
      }
    }

    return hasTouchScreen
  }

  ngAfterViewInit(): void {
    this.ctx.scale(this.SCALE, this.SCALE);
  }

  gameLoop() {

    this.enviroment.takeAction(this.direction);
    this.lastMovement = this.direction;
    this.isTerminalState = this.enviroment.isTerminalState();

    if (!this.isTerminalState) {
      this.drawGame();
      setTimeout(() => {
        this.gameLoop();
      }, 200)
    }
  }

  drawGame() {
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    this.drawSnake();
    this.drawApple();
  }

  drawSnake() {
    this.ctx.fillStyle = "#000000";
    this.enviroment.snake.forEach(element => {
      this.ctx.fillRect(
        element.x,
        this.WIDTH - 1 - element.y,
        1,
        1)
    })

  }

  drawApple() {
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillRect(
      this.enviroment.apple.x,
      this.WIDTH - 1 - this.enviroment.apple.y,
      1,
      1);
  }

  start() {
    this.enviroment = new Enviroment(this.HEIGHT, this.WIDTH);
    this.direction = "RIGHT";
    this.lastMovement = "RIGHT";
    this.drawGame();
    this.gameLoop();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.keyCode) {

      case KEY_CODE.LEFT_ARROW:
      case KEY_CODE.A_KEY:
        if (this.lastMovement != "RIGHT") {
          this.direction = "LEFT";
          break;
        }

      case KEY_CODE.RIGHT_ARROW:
      case KEY_CODE.D_KEY:
        if (this.lastMovement != "LEFT") {
          this.direction = "RIGHT";
          break;
        }

      case KEY_CODE.UP_ARROW:
      case KEY_CODE.W_KEY:
        if (this.lastMovement != "DOWN") {
          this.direction = "UP";
          break;
        }

      case KEY_CODE.DOWN_ARROW:
      case KEY_CODE.S_KEY:
        if (this.lastMovement != "UP") {
          this.direction = "DOWN";
          break;
        }
    }
  }

  touchMove(event: TouchEvent) {

    let gameViewBoundingRect = this.gameView.nativeElement.getBoundingClientRect();

    let touchRelativeX = event.touches[0].pageX - gameViewBoundingRect.x;
    let touchRelativeY = event.touches[0].pageY - gameViewBoundingRect.y;

    let height = gameViewBoundingRect.height
    let width = gameViewBoundingRect.width

    let percentX = (touchRelativeX) / width;
    let percentY = (touchRelativeY) / height;


    if (percentY > percentX) {
      if (1 - percentY > percentX) {
        if (this.lastMovement != "RIGHT") {
          this.direction = "LEFT"
        }
      } else {
        if (this.lastMovement != "UP") {
          this.direction = "DOWN"
        }
      }
    } else {
      if (1 - percentY > percentX) {
        if (this.lastMovement != "DOWN") {
          this.direction = "UP"
        }
      } else {
        if (this.lastMovement != "LEFT") {
          this.direction = "RIGHT"
        }
      }
    }
  }
}
