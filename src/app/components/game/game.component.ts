import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @ViewChild('gameCanvas', {static: true})
  gameCanvas: ElementRef<HTMLCanvasElement>

  constructor() { }

  ngOnInit(): void {

    let ctx: CanvasRenderingContext2D = this.gameCanvas.nativeElement.getContext("2d");
    ctx.fillRect(0, 0, 10, 10);
  }

}
