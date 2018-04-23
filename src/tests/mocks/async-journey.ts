import { SimpleState } from '../../main/models';

export const executedSteps: string[] = [];

export class StartStep extends SimpleState {
  run() {
    executedSteps.push('StartStep');
    this.stateMachine.next();
  }
}

export class FinishStep extends SimpleState {
  run() {
    executedSteps.push('FinishStep');
    this.stateMachine.next();
  }
}

export class YesCondition extends SimpleState {
  run() {
    executedSteps.push('YesCondition');
    this.stateMachine.next('yes');
  }
}

export class NoCondition extends SimpleState {
  run() {
    executedSteps.push('NoCondition');
    this.stateMachine.next('no');
  }
}

export class PositiveStep extends SimpleState {
  run() {
    executedSteps.push('PositiveStep');
    this.stateMachine.next();
  }
}

export class NegativeStep extends SimpleState {
  run() {
    executedSteps.push('NegativeStep');
    this.stateMachine.next();
  }
}

export class AsyncStep extends SimpleState {
  constructor(private index: number) {
    super();
  }

  run() {
    setTimeout(() => {
      executedSteps.push(`AsyncStep ${this.index}`);
      this.stateMachine.next();
    }, 10);
  }
}
