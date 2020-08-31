import { TestBed } from '@angular/core/testing';

import { SnakeRlAgentService } from './snake-rl-agent.service';

describe('SnakeRlAgentService', () => {
  let service: SnakeRlAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnakeRlAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
