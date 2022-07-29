import {
  Gesture,
  GestureOptions,
  MinMaxInterval,
  BooleanParameter,
  GestureParameterValue,
  LiveGestureEventData,
  GlobalGestureEventData,
  GestureEventData,
} from "./Gesture";

import { TimedParameters } from "../interfaces";

import { DualPointerInput } from "../DualPointerInput";

import { 
  GestureState,
  PointerManagerState
} from "../input-consts";


/**
 * GestureParameters are the PointerInputParameters a gesture is valid for
 * Keys match those of PointerInput.parameters.global
 */
interface DualPointerGestureGlobalParameters {
  duration: MinMaxInterval,
  centerHasBeenMoved: BooleanParameter,
  centerMovementDistance: MinMaxInterval, // the distance the center between 2 pointers has been moved
  absolutePointerDistanceChange: MinMaxInterval, // change in distance between 2 pointers
  relativePointerDistanceChange: MinMaxInterval,
  rotationAngle: MinMaxInterval,
  absoluteRotationAngle: MinMaxInterval,
  vectorAngle: MinMaxInterval,
  absoluteVectorAngle: MinMaxInterval,
}

/**
 * keys match those of PointerInput.parameters.live
 */
interface DualPointerGestureLiveParameters {
  centerIsMoving: BooleanParameter,
  centerMovementDistance: MinMaxInterval,
  absolutePointerDistanceChange: MinMaxInterval,
  relativePointerDistanceChange: MinMaxInterval,
  rotationAngle: MinMaxInterval,
  absoluteRotationAngle: MinMaxInterval,
  vectorAngle: MinMaxInterval,
  absoluteVectorAngle: MinMaxInterval,
}

export interface DualPointerGestureParameters extends TimedParameters {
  global: DualPointerGestureGlobalParameters,
  live: DualPointerGestureLiveParameters,
}

export abstract class DualPointerGesture extends Gesture {

  initialPointerEvent_1: PointerEvent | null;
  initialPointerEvent_2: PointerEvent | null;

  initialParameters: DualPointerGestureParameters;
  activeStateParameters: DualPointerGestureParameters;

  constructor(domElement: HTMLElement, options?: Partial<GestureOptions>) {
    super(domElement, options);
    this.initialPointerEvent_1 = null;
    this.initialPointerEvent_2 = null;
    this.validPointerManagerState = PointerManagerState.DualPointer;
    this.validPointerInputConstructor = DualPointerInput;

    var nullRecognitionParameters: DualPointerGestureParameters = {
      global: {
        duration: [null, null], // ms
        centerHasBeenMoved: null,
        centerMovementDistance: [null, null],
        absolutePointerDistanceChange: [null, null],
        relativePointerDistanceChange: [null, null],
        rotationAngle: [null, null],
        absoluteRotationAngle: [null, null],
        vectorAngle: [null, null],
        absoluteVectorAngle: [null, null],
      },

      live: {
        centerIsMoving: null,
        centerMovementDistance: [null, null], // px
        absolutePointerDistanceChange: [null, null],
        relativePointerDistanceChange: [null, null],
        rotationAngle: [null, null],
        absoluteRotationAngle: [null, null],
        vectorAngle: [null, null],
        absoluteVectorAngle: [null, null],
      }
    };

    this.initialParameters = { ...nullRecognitionParameters };
    this.activeStateParameters = JSON.parse(JSON.stringify({ ...nullRecognitionParameters }));
  }


  getPointerInputGlobalValue(
    pointerInput: DualPointerInput,
    parameterName: keyof DualPointerGestureGlobalParameters
  ): GestureParameterValue {
    const pointerInputValue = pointerInput.parameters.global[parameterName];
    return pointerInputValue;
  }

  getPointerInputLiveValue(
    pointerInput: DualPointerInput,
    parameterName: keyof DualPointerGestureLiveParameters
  ): GestureParameterValue {
    const pointerInputValue = pointerInput.parameters.live[parameterName];
    return pointerInputValue;
  }

  validateGestureParameters(pointerInput: DualPointerInput): boolean {

    var gestureParameters: DualPointerGestureParameters;

    let isValid: boolean = true;

    if (this.state == GestureState.Active) {
      gestureParameters = this.activeStateParameters;
      if (this.DEBUG == true) {
        console.log(`[${this.eventBaseName}] validating using activeStateParameters`);
        console.log(gestureParameters);
      }
    } else {
      if (this.DEBUG == true) {
        console.log(`[${this.eventBaseName}] validating using initialParameters`);
      }
      gestureParameters = this.initialParameters;
    }

    let timespan: keyof TimedParameters;
    for (timespan in gestureParameters){
      const timedGestureParameters = gestureParameters[timespan]; // .global or .live
      let parameterName: keyof typeof timedGestureParameters;
      for (parameterName in timedGestureParameters){

        if (this.DEBUG == true) {
          console.log(
            `[${this.eventBaseName}] validating ${timespan} parameter ${parameterName}:`
          );
        }

        const gestureParameter = timedGestureParameters[parameterName];

        var pointerInputValue: GestureParameterValue;

        if (timespan == "global"){
          pointerInputValue = this.getPointerInputGlobalValue(pointerInput, parameterName);
          isValid = this.validateGestureParameter(gestureParameter, pointerInputValue);
        }
        else if (timespan == "live"){
          pointerInputValue = this.getPointerInputLiveValue(pointerInput, parameterName);
          isValid = this.validateGestureParameter(gestureParameter, pointerInputValue);
        }
        else {
          isValid = false;
        }

        if (isValid == false){
          return false;
        }
        
      }
    }

    return true;

  }


  getEventData(dualPointerInput: DualPointerInput): GestureEventData {
    // provide short-cuts to the values collected in the Contact object
    // match this to the event used by hammer.js

    const globalParameters = dualPointerInput.parameters.global;
    const liveParameters = dualPointerInput.parameters.live;

    const globalGestureEventData: GlobalGestureEventData = {
      deltaX: globalParameters.centerMovementVector.x,
      deltaY: globalParameters.centerMovementVector.y,
      distance: globalParameters.centerMovementDistance,
      speedX: globalParameters.centerMovementVector.x / globalParameters.duration,
      speedY: globalParameters.centerMovementVector.y / globalParameters.duration,
      speed:
        globalParameters.centerMovementVector.vectorLength / globalParameters.duration,
      direction: globalParameters.centerMovementVector.direction,
      scale: globalParameters.relativePointerDistanceChange,
      rotation: globalParameters.rotationAngle,
      srcEvent: dualPointerInput.currentPointerEvent,
    };

    const liveGestureEventData: LiveGestureEventData = {
      deltaX: liveParameters.centerMovementVector.x,
      deltaY: liveParameters.centerMovementVector.y,
      distance: liveParameters.centerMovementDistance,
      speedX: liveParameters.centerMovementVector.x / globalParameters.duration,
      speedY: liveParameters.centerMovementVector.y / globalParameters.duration,
      speed: liveParameters.centerMovementVector.vectorLength / globalParameters.duration,
      direction: liveParameters.centerMovementVector.direction,
      scale: liveParameters.relativePointerDistanceChange,
      rotation: liveParameters.rotationAngle,
      center: {
        x: liveParameters.centerMovementVector.startPoint.x,
        y: liveParameters.centerMovementVector.startPoint.y,
      },
      srcEvent: dualPointerInput.currentPointerEvent,
    };

    const gestureEventData: GestureEventData = {
      recognizer: this,
      global: globalGestureEventData,
      live: liveGestureEventData
    }

    return gestureEventData;
  }

}