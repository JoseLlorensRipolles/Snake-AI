import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SnakeRlAgentService } from 'src/app/services/snake-rl-agent/snake-rl-agent.service'
import { Enviroment } from 'src/app/model/enviroment';

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

  constructor(private snakeRLAgent: SnakeRlAgentService) { }

  ngOnInit(): void {
    this.snakeRLAgent.start();
    this.enviroment = new Enviroment();
    this.ctx = this.gameCanvas.nativeElement.getContext("2d");
    this.ctx.scale(10, 10);

    this.showLastGame();
  }

  showLastGame() {
    this.enviroment.reset();
    setTimeout(() => {
      console.log(this.snakeRLAgent.getLastGameActions());
      
      if (this.snakeRLAgent.getLastGameActions() ) {
        this.drawGame(this.snakeRLAgent.getLastGameActions())
      } else {
        this.showLastGame();
      }
    }, 1000)
  }

  drawGame(actions: string[]) {
    setTimeout(() => {
      if (actions.length > 0) {
        let aT = actions.shift();
        this.enviroment.takeAction(aT);
        this.ctx.clearRect(0, 0, this.enviroment.boardDim.x, this.enviroment.boardDim.y);
        this.drawSnake();
        this.drawApple();
        this.drawGame(actions)
      }else{
        this.showLastGame();
      }
    }, 200)

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
}
