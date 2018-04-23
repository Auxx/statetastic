import { expect } from 'chai';
import 'mocha';

import { StateMachine, Fork } from '../../main';
import { SimpleStateMock } from '../mocks/simple-state-mock';
import { Loop } from '../../main/lib/loop';

describe('StateMachine', () => {
  let simpleStates: SimpleStateMock[];

  beforeEach(() => {
    simpleStates = [
      new SimpleStateMock('1'),
      new SimpleStateMock('2'),
      new SimpleStateMock('3')
    ];
  });

  it('should run first state on start', () => {
    const fsm = new StateMachine(simpleStates);
    fsm.start();

    expect(simpleStates[ 0 ].callCounter).to.eq(1, 'first step called');
    expect(simpleStates[ 1 ].callCounter).to.eq(0, 'second step not called');
    expect(simpleStates[ 2 ].callCounter).to.eq(0, 'third step not called');
  });

  it('should go from start to finish', () => {
    const fsm = new StateMachine(simpleStates);
    fsm.start();

    simpleStates[ 0 ].advance();
    expect(simpleStates[ 1 ].callCounter).to.eq(1, 'second step called');

    simpleStates[ 1 ].advance();
    expect(simpleStates[ 2 ].callCounter).to.eq(1, 'second step called');
  });

  it('should go from start to finish and back', () => {
    const fsm = new StateMachine(simpleStates);
    fsm.start();

    simpleStates[ 0 ].advance();
    simpleStates[ 1 ].advance();
    simpleStates[ 2 ].rewind();
    simpleStates[ 1 ].rewind();

    expect(simpleStates[ 0 ].callCounter).to.eq(2, 'first step called twice');
    expect(simpleStates[ 1 ].callCounter).to.eq(2, 'second step called twice');
    expect(simpleStates[ 2 ].callCounter).to.eq(1, 'third step called once');
  });

  it('should fork on condition', () => {
    const start = new SimpleStateMock('Start');
    const condition = new SimpleStateMock('Fork condition');
    const yes = new SimpleStateMock('Yes path');
    const no = new SimpleStateMock('No path');
    const finish = new SimpleStateMock('Finish');

    const fsm = new StateMachine([
      start,
      condition,
      new Fork({
        'yes': yes,
        'no': no
      }),
      finish
    ]);

    fsm.start();

    start.advance();
    condition.advance('yes');

    expect(start.callCounter).to.eq(1, 'start step called');
    expect(condition.callCounter).to.eq(1, 'condition step called');
    expect(yes.callCounter).to.eq(1, 'yes step called');
    expect(no.callCounter).to.eq(0, 'no step not called');

    yes.advance();

    expect(no.callCounter).to.eq(0, 'no step not called');
    expect(finish.callCounter).to.eq(1, 'finish step called');
  });

  it('should go through the loop', () => {
    const start = new SimpleStateMock('Start');
    const step1 = new SimpleStateMock('Loop step 1');
    const step2 = new SimpleStateMock('Loop step 2');
    const step3 = new SimpleStateMock('Loop step 3');
    const finish = new SimpleStateMock('Finish');

    const fsm = new StateMachine([
      start,
      new Loop([ step1, step2, step3 ]),
      finish
    ]);

    fsm.start();

    start.advance();
    step1.advance();
    step2.advance();
    step3.advance();

    expect(start.callCounter).to.eq(1, 'start step called');
    expect(step1.callCounter).to.eq(1, 'step #1 called');
    expect(step2.callCounter).to.eq(1, 'step #2 called');
    expect(step3.callCounter).to.eq(1, 'step #3 called');
    expect(finish.callCounter).to.eq(1, 'finish step called');
  });

  it('should loop when needed', () => {
    const start = new SimpleStateMock('Start');
    const step1 = new SimpleStateMock('Loop step 1');
    const step2 = new SimpleStateMock('Loop step 2');
    const step3 = new SimpleStateMock('Loop step 3');
    const finish = new SimpleStateMock('Finish');

    const fsm = new StateMachine([
      start,
      new Loop([ step1, step2, step3 ]),
      finish
    ]);

    fsm.start();

    start.advance();
    step1.advance();
    step2.advance();
    step3.loopback();

    step1.advance();
    step2.advance();
    step3.advance();

    expect(start.callCounter).to.eq(1, 'start step called');
    expect(step1.callCounter).to.eq(2, 'step #1 called twice');
    expect(step2.callCounter).to.eq(2, 'step #2 called twice');
    expect(step3.callCounter).to.eq(2, 'step #3 called twice');
    expect(finish.callCounter).to.eq(1, 'finish step called');
  });
});
