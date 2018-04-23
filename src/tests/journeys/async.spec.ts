import { expect } from 'chai';
import 'mocha';

import { FsmFactory } from '../../main';
import {
  AsyncStep,
  executedSteps,
  FinishStep,
  NegativeStep,
  NoCondition,
  PositiveStep,
  StartStep,
  YesCondition
} from '../mocks/async-journey';

describe('Async Journey', () => {
  it('should go well, lol', (done) => {
    const fsm = FsmFactory.create([
      new StartStep(),
      new YesCondition(),
      {
        yes: new PositiveStep(),
        no: new NegativeStep()
      },
      new NoCondition(),
      {
        yes: new PositiveStep(),
        no: new NegativeStep()
      },
      [ new AsyncStep(1), new AsyncStep(2), new AsyncStep(3) ],
      new FinishStep()
    ]);

    fsm
      .start()
      .subscribe(() => {
        expect(executedSteps.length).to.eq(9, 'nine steps overall');
        expect(executedSteps[0]).to.eq('StartStep', '');
        expect(executedSteps[1]).to.eq('YesCondition', '');
        expect(executedSteps[2]).to.eq('PositiveStep', '');
        expect(executedSteps[3]).to.eq('NoCondition', '');
        expect(executedSteps[4]).to.eq('NegativeStep', '');
        expect(executedSteps[5]).to.eq('AsyncStep 1', '');
        expect(executedSteps[6]).to.eq('AsyncStep 2', '');
        expect(executedSteps[7]).to.eq('AsyncStep 3', '');
        expect(executedSteps[8]).to.eq('FinishStep', '');

        done();
      });
  });
});
