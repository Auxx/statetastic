import { StateHost } from './state-host';

export abstract class State {
  stateMachine: StateHost;

  abstract onEnter(result?: string | undefined, data?: any | undefined): void;

  abstract run(): void;

  abstract onExit(): void;
}

export abstract class SimpleState extends State {
  onEnter() {
  }

  onExit() {
  }
}

export interface StateArguments {
  result?: string;
  data?: any;
}
