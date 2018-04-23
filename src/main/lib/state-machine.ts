import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

import { StartOfListError, State, StateArguments, StateGraph, StateHost } from '../models';

export class StateMachine implements StateHost {
  private readonly _host: StateHost;

  private _currentState: State | null;
  private _currentIndex: number;
  private _onFinish: Subject<StateArguments> = new ReplaySubject<StateArguments>(1);

  constructor(private readonly _stateList: StateGraph, host?: StateHost | undefined) {
    this._host = host === undefined ? this : host;
  }

  start(result?: string | undefined, data?: any | undefined): Observable<StateArguments> {
    if (this._stateList.length === 0) {
      throw new RangeError('State list is empty');
    }

    this._currentState = null;
    this._currentIndex = -1;
    this.execute(0, result, data);

    return this._onFinish;
  }

  get currentState(): State {
    return this._currentState;
  }

  get currentIndex(): number {
    return this._currentIndex;
  }

  next(result?: string | undefined, data?: any | undefined): void {
    const index = this._currentIndex + 1;

    if (index >= this._stateList.length) {
      this._onFinish.next({ result: result, data: data });
      this._onFinish.complete();
      return;
      // throw new EndOfListError(`Reached end of state list, can't move forward`);
    }

    this.execute(index, result, data);
  }

  prev(result?: string | undefined, data?: any | undefined): void {
    const index = this._currentIndex - 1;

    if (index < 0) {
      throw new StartOfListError(`Reached start of state list, can't rewind`);
    }

    this.execute(index, result, data);
  }

  restart(): void {
    this._currentState.run();
  }

  private execute(index: number, result?: string | undefined, data?: any | undefined) {
    if (this._currentIndex >= 0 && this._currentState !== null) {
      this._currentState.onExit();
    }

    this._currentIndex = index;
    this._currentState = this._stateList[ this._currentIndex ];
    this._currentState.stateMachine = this._host;
    this._currentState.onEnter(result, data);
    this._currentState.run();
  }
}
