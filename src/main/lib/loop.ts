import { State, StateArguments, StateGraph, StateHost } from '../models';
import { StateMachine } from './state-machine';

export const LoopRestart = 'LoopRestart';

export class Loop extends State implements StateHost {
  private fsm: StateMachine;

  private result: string | undefined;
  private data: any | undefined;

  constructor(private stateList: StateGraph) {
    super();
    this.initFsm();
  }

  onEnter(result?: string | undefined, data?: any | undefined): void {
    this.result = result;
    this.data = data;
  }

  run(): void {
    this.fsm
      .start(this.result, this.data)
      .subscribe(args => this.onFinish(args));
  }

  onExit(): void {
    this.fsm.currentState.onExit();
  }

  next(result?: string | undefined, data?: any | undefined): void {
    this.fsm.next(result, data);
  }

  prev(result?: string | undefined, data?: any | undefined): void {
    this.fsm.prev(result, data);
  }

  restart(): void {
    this.initFsm();
    this.run();
  }

  private initFsm() {
    this.fsm = new StateMachine(this.stateList, this);
  }

  private onFinish(args: StateArguments) {
    if (args.result === LoopRestart) {
      this.restart();
    } else {
      this.stateMachine.next(args.result, args.data);
    }
  }
}
