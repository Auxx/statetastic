import { State, StateFork } from '../models';

export class Fork extends State {
  private state: State | null = null;

  constructor(private stateMap: StateFork) {
    super();
  }

  onEnter(result?: string | undefined, data?: any | undefined): void {
    if (!this.stateMap.hasOwnProperty(result)) {
      this.state = null;
      throw new RangeError(`Can't fork to ${result}, no such state available`);
    }

    this.state = this.stateMap[ result ];
    this.state.stateMachine = this.stateMachine;
    this.state.onEnter(result, data);
  }

  run(): void {
    this.state.run();
  }

  onExit(): void {
    this.state.onExit();
  }
}
