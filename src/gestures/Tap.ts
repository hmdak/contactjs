import { GestureOptions } from "./Gesture";
import { SinglePointerGesture } from "./SinglePointerGesture";
import { PointerManager } from "../PointerManager";
import { SinglePointerInput } from "../SinglePointerInput";
import { PointerManagerState } from "../input-consts";

/*
 * TAP DEFINITION
 * - user touches the screen with one finger or presses the mouse button down
 * - the finger does not move for x ms
 * - no additional fingers are added
 * - the finger is released, Tap is no recognized
 */
export class Tap extends SinglePointerGesture {

  constructor(domElement: HTMLElement, options?: Partial<GestureOptions>) {
    super(domElement, options);

    this.validPointerManagerState = PointerManagerState.NoPointer;

    this.eventBaseName = "tap";

    this.initialParameters.global.max["duration"] = 200; // milliseconds. after a certain touch duration, it is not a TAP anymore

    this.initialParameters.live.max["distance"] = 30; // if a certain distance is detected, TAP becomes impossible
    this.initialParameters.global.max["distance"] = 30; // if a certain distance is detected, TAP becomes impossible

  }

  validate(pointerManager: PointerManager): boolean {

    let isValid = this.validateGestureState();

    if (isValid == true){
      isValid = this.validatePointerManagerState(pointerManager);
    }

    if (isValid === true) {

      if (pointerManager.lastInputSessionPointerCount != 1) {
        return false;
      }
      else {

        const singlePointerInput = pointerManager.getlastRemovedPointerInput();

        if (singlePointerInput instanceof SinglePointerInput) {

          isValid = this.validateGestureParameters(singlePointerInput);

        }
        else {
          isValid = false;
        }
      }

    }

    return isValid;
  }

  // do not set Tap.state = GestureState.active as Tap has no active state
  onStart(pointerManager: PointerManager): void {
    this.setInitialPointerEvent(pointerManager);
    this.emit(pointerManager);
  }

}