import { StateConfig, StateGraph, State, StateFork } from '../models';
import { Loop } from './loop';
import { Fork } from './fork';
import { StateMachine } from './state-machine';

export class FsmFactory {
  static create(config: StateConfig) {
    return new StateMachine(config.map(item => FsmFactory.processItem(item)));
  }

  private static processItem(item: State | StateGraph | StateFork): State {
    if (item instanceof State) {
      return item;
    }

    if (item instanceof Array) {
      return new Loop(item);
    }

    return new Fork(item);
  }
}
