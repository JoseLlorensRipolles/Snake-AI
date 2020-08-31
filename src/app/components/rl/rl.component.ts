import { Component, OnInit } from '@angular/core';
import { SnakeRlAgentService} from 'src/app/services/snake-rl-agent/snake-rl-agent.service'

@Component({
  selector: 'app-rl',
  templateUrl: './rl.component.html',
  styleUrls: ['./rl.component.scss']
})

export class RlComponent implements OnInit{

  constructor(private snakeRLAgent: SnakeRlAgentService) { }
  
  ngOnInit(): void {
    this.snakeRLAgent.start();
  }
}
