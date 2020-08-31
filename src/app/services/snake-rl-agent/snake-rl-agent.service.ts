import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { Enviroment } from 'src/app/model/enviroment';
import { NgPlural } from '@angular/common';
import { Point } from 'src/app/model/point';

export enum ActionsIdx {
  "UP" = 0,
  "DOWN" = 1,
  "RIGHT" = 2,
  "LEFT" = 3
};

@Injectable({
  providedIn: 'root'
})

export class SnakeRlAgentService {

  network: any;
  enviroment: Enviroment;
  lastGameSnakesAndApples: [Point[], Point][] ;

  INITIAL_EPSILON = 0.2;
  GAMMA = 0.9;
  ACTIONS = ["UP", "DOWN", "RIGHT", "LEFT"];

  constructor() { }

  public start() {
    this.initializeNetwork();
    this.enviroment = new Enviroment();
    this.train();
  }

  async train() {
    for (let i = 0; i < 100000; i++) {
      this.enviroment.reset();
      let stepCounter = 0;
      let episodeSnakesAndApples: [Point[], Point][] = [];
      let epsilon = this.INITIAL_EPSILON / i
      do {
        episodeSnakesAndApples.push([this.enviroment.snake.map(x => Object.assign({}, x)), this.enviroment.apple]);

        let sT = this.enviroment.getState();
        let aT = await this.epsilonGreedyChoose(sT, epsilon);
        let r = this.enviroment.takeAction(aT);
        let sT1 = this.enviroment.getState();
        let isTerminal = this.enviroment.isTerminalState();
        let sequence = [sT, aT, r, sT1, isTerminal];
        
        await this.trainShortMemory(sequence);
        stepCounter++;
      } while (!this.enviroment.isTerminalState());

      this.lastGameSnakesAndApples = episodeSnakesAndApples;
      console.log(stepCounter, this.enviroment.snake.length);

    }
  }

  getLastGameSnakesAndApples(): [Point[], Point][] {
    return this.lastGameSnakesAndApples;
  }

  printSequence(sequence: any[]) {
    console.log(sequence[0].arraySync(), sequence[1], sequence[2], sequence[3].arraySync(), sequence[4]);

  }


  async trainShortMemory(sequence) {
    let targetAtValue;

    if (sequence[4]) {
      targetAtValue = sequence[2];
    } else {
      targetAtValue = await this.computeTarget(sequence);
    }

    let targets = await this.network.predict(sequence[0]).array();
    targets = targets[0];
    targets[ActionsIdx[sequence[1]]] = targetAtValue;
    targets = tf.tensor2d([targets]);

    let aux = targets.arraySync();

    await this.network.fit(
      sequence[0],
      targets,
      {
        epochs: 1
      }
    );
  }

  async computeTarget(sequence: any) {
    let aux = await this.network.predict(sequence[3]).array();
    aux = aux[0];
    let targetAtValue = sequence[2] + this.GAMMA * Math.max.apply(Math, aux);
    return targetAtValue;
  }

  async epsilonGreedyChoose(sT, epsilon) {
    if (Math.random() < epsilon) {
      return this.ACTIONS[Math.floor(Math.random() * this.ACTIONS.length)]
    } else {
      let output = await this.network.predict(sT).array();
      let bestActionIdx = this.argMax(output[0]);
      return this.ACTIONS[bestActionIdx];
    }
  }

  argMax(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  initializeNetwork() {
    this.network = tf.sequential();

    this.network.add(tf.layers.dense({
      inputShape: [8],
      activation: 'relu',
      units: 1000
    }))

    this.network.add(tf.layers.dense({
      inputShape: [8],
      activation: 'relu',
      units: 100
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
