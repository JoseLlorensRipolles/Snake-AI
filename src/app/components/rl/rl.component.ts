import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { Enviroment } from 'src/app/model/enviroment';
import { NgPlural } from '@angular/common';

@Component({
  selector: 'app-rl',
  templateUrl: './rl.component.html',
  styleUrls: ['./rl.component.scss']
})

export class RlComponent implements OnInit {

  network: any;
  enviroment: Enviroment;
  EPSILON = 0.1;
  GAMMA = 0.9;
  ACTIONS = ["UP", "DOWN", "RIGHT", "LEFT"];

  constructor() { }

  ngOnInit(): void {
    this.start();
  }

  start() {
    this.initializeNetwork();
    this.enviroment = new Enviroment();
    this.train();
  }

  async train() {
    for (let i = 0; i < 10; i++) {
      this.enviroment.reset();
      let isTerminal = this.enviroment.isTerminalState();

      let stepCounter = 0;

      while (!isTerminal) {
        let sT = tf.tensor2d([this.enviroment.getState()]);
        let aT = await this.epsilonGreedyChoose(sT);
        let r = this.enviroment.takeAction(aT);
        let sT1 = this.enviroment.getState();
        isTerminal = this.enviroment.isTerminalState();

        let sequence = [sT, aT, r, sT1, isTerminal];
        await this.trainShortMemory(sequence);
        stepCounter++;
      }
      console.log(stepCounter);

    }
  }
  async trainShortMemory(sequence) {
    let targetAtValue;

    if (sequence[4]) {
      targetAtValue = sequence[2];
    } else {
      targetAtValue = this.computeTarget(sequence);
    }

    let targets = await this.network.predict(sequence[0]).array();
    targets[sequence[1]] = targetAtValue;

    this.network.fit(
      tf.tensor2d([sequence[0]]),
      tf.tensor2d([targets]),
      {
        epochs: 1
      }
    );
  }

  async computeTarget(sequence: any) {
    let aux = await this.network.predict(sequence[3]).array();
    let targetAtValue = sequence[2] + this.GAMMA * Math.max.apply(Math, aux);
    return targetAtValue;
  }

  async epsilonGreedyChoose(sT) {
    if (Math.random() < this.EPSILON) {
      return this.ACTIONS[Math.floor(Math.random() * this.ACTIONS.length)]
    } else {
      let output = await this.network.predict(sT).array();
      let bestActionIdx = this.argMax(output);
      return this.ACTIONS[bestActionIdx];
    }
  }

  argMax(array) {
    console.log(array);

    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  initializeNetwork() {
    this.network = tf.sequential();

    this.network.add(tf.layers.dense({
      inputShape: [8],
      activation: 'relu',
      units: 10
    }))

    this.network.add(tf.layers.dense({
      units: 4,
      activation: "softmax"
    }))

    this.network.compile({
      optimizer: tf.train.adam(),
      loss: "categoricalCrossentropy"
    })
  }
}
