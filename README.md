# statetastic

Finite state machine implementation in TypeScript.

## Install

With npm: `$ npm i rxjs statetastic --save`

With yarn: `$ yarn add rxjs statetastic`

## Usage

Define your state classes. Simple states can be extended from `SimpleState`:

```javascript
export class MyStep extends SimpleState {
  run() {
    console.log('MyStep is up and running!');
    this.stateMachine.next();
  }
}
```

Extend from `State` instead if you want to handle additional state life-cycle events `onEnter` and `onExit`.

Next, configure state machine with `FsmFactory`:

```javascript
const fsm = FsmFactory.create([
  new MyStep(),
  new MyOtherStep()
]);
```

Finally, run the machine and listen for it to finish:

```javascript
fsm.start().subscribe(() => console.log('Finished!');
```

Check `src/tests/journeys/async.spec.ts` for a more complex example.
