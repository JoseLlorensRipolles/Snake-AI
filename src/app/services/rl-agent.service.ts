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

  INITIAL_EPSILON = 1;
  EPSILON_DECAY = 0.95;
  MINUMUM_EPSILON = 0.005;
  GAMMA = 0.9;
  ACTIONS = ["UP", "DOWN", "RIGHT", "LEFT"];

  constructor() { }

  public start() {
    this.initializeNetwork();
    this.enviroment = new Enviroment();
    this.train();
  }

  async train() {
    for (let episodeNumber = 0; episodeNumber < 100000; episodeNumber++) {
      this.enviroment.reset();
      let stepCounter = 0;
      let episodeSnakesAndApples: [Point[], Point][] = [];
      do {
        episodeSnakesAndApples.push([this.enviroment.snake.map(x => Object.assign({}, x)), this.enviroment.apple]);

        let sT = tf.tensor2d([this.enviroment.getState()]);
        let aT = await this.epsilonGreedyChoose(sT, episodeNumber);
        let r = this.enviroment.takeAction(aT);
        let sT1 = tf.tensor2d([this.enviroment.getState()]);
        let isTerminal = this.enviroment.isTerminalState();
        let sequence = [sT, aT, r, sT1, isTerminal];
        
        await this.trainForSequence(sequence);
        stepCounter++;
      } while (!this.enviroment.isTerminalState());

      this.lastGameSnakesAndApples = episodeSnakesAndApples;
      console.log(stepCounter, this.enviroment.snake.length);

    }
  }

  getLastGameSnakesAndApples(): [Point[], Point][] {
    return this.lastGameSnakesAndApples;
  }

  async trainForSequence(sequence) {
    let actionTarget;

    if (sequence[4]) {
      actionTarget = sequence[2];
    } else {
      actionTarget = await this.computeTarget(sequence);
    }

    let targets = await this.network.predict(sequence[0]).array();
    targets = targets[0];
    targets[ActionsIdx[sequence[1]]] = actionTarget;
    targets = tf.tensor2d([targets]);

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
    let actionTarget = sequence[2] + this.GAMMA * Math.max.apply(Math, aux);
    return actionTarget;
  }

  async epsilonGreedyChoose(sT, t) {

    let epsilon = Math.min(this.INITIAL_EPSILON * Math.pow(this.EPSILON_DECAY, t), this.MINUMUM_EPSILON)
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
      units: 500
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
