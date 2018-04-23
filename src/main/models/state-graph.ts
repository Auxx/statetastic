import { State } from './state';

export type StateConfig = (State | StateGraph | StateFork)[];

export type StateGraph = State[];

export interface StateFork {
  [ key: string ]: State;
}
