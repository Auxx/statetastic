import { SimpleState, LoopRestart } from '../../main';

export class SimpleStateMock extends SimpleState {
  callCounter = 0;

  constructor(public dummyData: string) {
    super();
  }

  run() {
    this.callCounter++;
  }

  advance(result?: string) {
    this.stateMachine.next(result);
  }

  rewind() {
    this.stateMachine.prev();
  }

  loopback() {
    this.stateMachine.next(LoopRestart);
  }
}
