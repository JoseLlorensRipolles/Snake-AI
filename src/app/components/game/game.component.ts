import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Point } from '../../model/point';
import { Enviroment } from '../../model/enviroment';

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

  constructor() { }

  ngOnInit(): void {

    this.ctx = this.gameCanvas.nativeElement.getContext("2d");
    this.ctx.scale(10, 10);
    this.enviroment = new Enviroment();

    this.drawSnake();
  }

  drawSnake() {
    this.enviroment.getSnake().forEach(element => {
      this.ctx.fillRect(element.getX(), element.geyY(), 1, 1)
    })

  }

}
