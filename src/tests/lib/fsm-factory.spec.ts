import { expect } from 'chai';
import 'mocha';

import { FsmFactory } from '../../main/lib/fsm-factory';
import { SimpleStateMock } from '../mocks/simple-state-mock';
import { StateMachine } from '../../main/lib';

describe('FsmFactory', () => {
  it('should create State Machine', () => {
    const start = new SimpleStateMock('start');
    const condition = new SimpleStateMock('condition');
    const yes = new SimpleStateMock('yes');
    const no = new SimpleStateMock('no');
    const loop1 = new SimpleStateMock('loop 1');
    const loop2 = new SimpleStateMock('loop 2');
    const loop3 = new SimpleStateMock('loop 3');
    const finish = new SimpleStateMock('finish');

    const fsm = FsmFactory.create([
      start,
      condition,
      {
        yes: yes,
        no: no
      },
      [ loop1, loop2, loop3 ],
      finish
    ]);

    expect(fsm).to.be.instanceOf(StateMachine, 'new StateMachine instance');

    fsm.start();
    start.advance();
    condition.advance('no');
    no.advance();
    loop1.advance();
    loop2.advance();
    loop3.advance();

    expect(start.callCounter).to.eq(1, 'start step called');
    expect(condition.callCounter).to.eq(1, 'condition step called');
    expect(yes.callCounter).to.eq(0, 'yes step not called');
    expect(no.callCounter).to.eq(1, 'no step called');
    expect(loop1.callCounter).to.eq(1, 'step #1 called once');
    expect(loop2.callCounter).to.eq(1, 'step #2 called once');
    expect(loop3.callCounter).to.eq(1, 'step #3 called once');
    expect(finish.callCounter).to.eq(1, 'finish step called');
  });
});
