export enum Direction {
    None = "0",
    Left = "left",
    Right = "right",
    Up = "up",
    Down = "down"
}
export const Directions: Readonly<{
    Horizontal: Direction[];
    Vertical: Direction[];
    All: Direction[];
}>;
export enum GestureState {
    Inactive = "inactive",
    Active = "active",
    Blocked = "blocked"
}
enum PointerManagerState {
    NoPointer = "nopointer",
    SinglePointer = "singlepointer",
    DualPointer = "dualpointer"
}
enum PointerListenerState {
    NoActiveGesture = "noactivegesture",
    ActiveGesture = "activegesture"
}
declare class Point {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
}
declare class Vector {
    readonly vectorLength: number;
    readonly startPoint: Point;
    readonly endPoint: Point;
    readonly direction: Direction;
    readonly deltaX: number;
    readonly deltaY: number;
    readonly x: number;
    readonly y: number;
    constructor(startPoint: Point, endPoint: Point);
}
export class Geometry {
    static getVector(startPointerEvent: PointerEvent, endPointerEvent: PointerEvent): Vector;
    static getSpeed(vector: Vector, startTimestamp: number, endTimestamp: number): number;
    static calculateRotationAngle(vector_1: Vector, vector_2: Vector): number;
    static calculateVectorAngle(vector_1: Vector, vector_2: Vector): number;
    static translatePoint(point: Point, vector: Vector): Point;
    static calcAngleDegrees(point: Point): number;
    static calcAngleRad(point: Point): number;
    static deg2rad(angleDeg: number): number;
    static rad2deg(angleRad: number): number;
    static getCenter(pointA: Point, pointB: Point): Point;
    static getCenterMovementVector(vector_1: Vector, vector_2: Vector): Vector;
    static calculateAbsoluteDistanceChange(vector_1: Vector, vector_2: Vector): number;
    static calculateRelativeDistanceChange(vector_1: Vector, vector_2: Vector): number;
}
interface TimedParameters {
    global: Record<string, any>;
    live: Record<string, any>;
}
interface MinMaxIntervalBool {
    min: Record<string, any>;
    max: Record<string, any>;
    boolean: Record<string, any>;
}
interface TimedMinMaxParameters extends TimedParameters {
    global: MinMaxIntervalBool;
    live: MinMaxIntervalBool;
}
interface PointerGlobalNumberParameters {
    duration: number;
    currentSpeed: number;
    averageSpeed: number;
    finalSpeed: number;
    distance: number;
    maximumDistance: number;
    startX: number;
    startY: number;
    deltaX: number;
    deltaY: number;
    startTimestampUTC: number;
    startTimestamp: number;
    currentTimestamp: number;
    endTimestamp: number | null;
    maximumSpeed: number;
    traveledDistance: number;
}
interface GeometricParameters {
    vector: Vector;
}
interface PointerGlobalBooleanParameters {
    hasBeenMoved: boolean;
}
interface PointerGlobalParameters extends PointerGlobalNumberParameters, GeometricParameters, PointerGlobalBooleanParameters {
}
interface PointerLiveNumberParameters {
    duration: number;
    speed: number;
    distance: number;
}
interface PointerLiveBooleanParameters {
    isMoving: boolean;
}
interface PointerLiveParameters extends PointerLiveNumberParameters, GeometricParameters, PointerLiveBooleanParameters {
}
interface PointerParameters extends TimedParameters {
    global: PointerGlobalParameters;
    live: PointerLiveParameters;
}
/**
 * Intervals for which a single pointer gesture is valid
 */
interface SinglePointerGestureParameters extends TimedMinMaxParameters {
    global: {
        min: Partial<PointerGlobalNumberParameters>;
        max: Partial<PointerGlobalNumberParameters>;
        boolean: PointerGlobalBooleanParameters;
    };
    live: {
        min: Partial<PointerLiveNumberParameters>;
        max: Partial<PointerLiveNumberParameters>;
        boolean: Partial<PointerLiveBooleanParameters>;
    };
}
/**
 * Dual Pointer interfaces
 */
interface DualPointerInputGlobalNumberParameters {
    duration: number;
    centerMovementDistance: number;
    absolutePointerDistanceChange: number;
    relativePointerDistanceChange: number;
    rotationAngle: number;
    absoluteRotationAngle: number;
    vectorAngle: number;
    absoluteVectorAngle: number;
}
interface DualPointerInputGlobalBooleanParameters {
    centerHasBeenMoved: boolean;
}
interface DualPointerInputGeometricParameters {
    centerMovementVector: Vector;
    center: Point;
}
interface DualPointerInputGlobalParameters extends DualPointerInputGlobalNumberParameters, DualPointerInputGlobalBooleanParameters, DualPointerInputGeometricParameters {
}
interface DualPointerInputLiveNumberParameters {
    centerMovementDistance: number;
    centerMovementVector: Vector;
    absolutePointerDistanceChange: number;
    relativePointerDistanceChange: number;
    rotationAngle: number;
    absoluteRotationAngle: number;
    vectorAngle: number;
    absoluteVectorAngle: number;
}
interface DualPointerInputLiveBooleanParameters {
    centerIsMoving: boolean;
}
interface DualPointerInputLiveParameters extends DualPointerInputLiveNumberParameters, DualPointerInputLiveBooleanParameters, DualPointerInputGeometricParameters {
}
interface DualPointerInputParameters extends TimedParameters {
    global: DualPointerInputGlobalParameters;
    live: DualPointerInputLiveParameters;
}
/**
 * Intervals for which a dual pointer gesture is valid
 */
interface DualPointerGestureParameters extends TimedMinMaxParameters {
    global: {
        min: Partial<DualPointerInputGlobalNumberParameters>;
        max: Partial<DualPointerInputGlobalNumberParameters>;
        boolean: Partial<DualPointerInputGlobalBooleanParameters>;
    };
    live: {
        min: Partial<DualPointerInputLiveNumberParameters>;
        max: Partial<DualPointerInputLiveNumberParameters>;
        boolean: Partial<DualPointerInputLiveBooleanParameters>;
    };
}
/*********************************************************************************************************************
  PointerInput

  - contains data about one single finger / pointer
  - there are "live" parameters and "global" parameters
  - "live" parameters are caluclated using liveTimespan
  - "global" parameters are calculated using the whole timespan of this pointerdown
  - the current vector. The vector should be calculated "live" and not over the whole pointerdown duration.
  The user expects the pointer input to be in sync with his current finger movement on the screen,
  not with something a second ago.
  - start and end coordinates
  - start and end timestamps
  - speeds and distances
********************************************************************************************************************/
interface PointerOptions {
    DEBUG: boolean;
    vectorTimespan?: number;
}
enum PointerState {
    Active = "active",
    Removed = "removed",
    Canceled = "canceled"
}
declare class Pointer {
    readonly options: PointerOptions;
    DEBUG: boolean;
    vectorTimespan: number;
    readonly pointerId: number;
    readonly parameters: PointerParameters;
    readonly initialPointerEvent: PointerEvent;
    currentPointerEvent: PointerEvent;
    recognizedEvents: PointerEvent[];
    state: PointerState;
    constructor(pointerEvent: PointerEvent, options?: PointerOptions);
    getTarget(): EventTarget | null;
    reset(): void;
    onIdle(): void;
    onPointerMove(pointermoveEvent: PointerEvent): void;
    onPointerUp(pointerupEvent: PointerEvent): void;
    onPointerLeave(pointerleaveEvent: PointerEvent): void;
    onPointerCancel(pointercancelEvent: PointerEvent): void;
    update(pointerEvent: PointerEvent): void;
}
declare class SinglePointerInput {
    pointer: Pointer;
    readonly parameters: PointerParameters;
    constructor(pointer: Pointer);
    getTarget(): EventTarget | null;
    getCurrentPointerEvent(): PointerEvent;
    getCurrentDirection(): string;
    onIdle(): void;
    onPointerMove(pointermoveEvent: PointerEvent): void;
    onPointerUp(pointerupEvent: PointerEvent): void;
    onPointerLeave(pointerleaveEvent: PointerEvent): void;
    onPointerCancel(pointercancelEvent: PointerEvent): void;
}
/**
 * DualPointerInput
 * 	- For gestures like Pinch, Rotate, TwoFingerPan
 */
declare class DualPointerInput {
    readonly pointerIds: Set<number>;
    readonly pointerMap: Record<number, Pointer>;
    readonly pointer_1: Pointer;
    readonly pointer_2: Pointer;
    readonly parameters: DualPointerInputParameters;
    readonly initialPointerEvent: PointerEvent;
    currentPointerEvent: PointerEvent;
    readonly startTimestamp: number;
    constructor(pointer_1: Pointer, pointer_2: Pointer);
    removePointer(pointerId: number): Pointer;
    getTarget(): EventTarget | null;
    update(pointerEvent?: PointerEvent): void;
    onPointerMove(pointermoveEvent: PointerEvent): void;
    onPointerUp(pointerupEvent: PointerEvent): void;
    onPointerLeave(pointerleaveEvent: PointerEvent): void;
    onPointerCancel(pointercancelEvent: PointerEvent): void;
    onIdle(): void;
    getCurrentDirection(): string;
    getCurrentPointerEvent(): PointerEvent;
}
interface PointerManagerOptions {
    DEBUG: boolean;
}
declare class PointerManager {
    DEBUG: boolean;
    activePointerInput: SinglePointerInput | DualPointerInput | null;
    lastRemovedPointer: Pointer | null;
    lastInputSessionPointerCount: number;
    state: PointerManagerState;
    options: PointerManagerOptions;
    constructor(options?: Partial<PointerManagerOptions>);
    addPointer(pointerdownEvent: PointerEvent): void;
    /**
     * called on the following events: pointerup, pointerleave(?), pointercancel
     * 1 -> 0 : SinglePointerInput -> null
     * 2 -> 1 : DualPointerInput -> SinglePointerInput
     * 3 -> 2 : DualPointerInput -> DualPointerInput (new combination or no change)
     */
    removePointer(pointerId: number): void;
    setActiveSinglePointerInput(pointer: Pointer): void;
    setActiveDualPointerInput(pointer_1: Pointer, pointer_2: Pointer): void;
    hasPointersOnSurface(): boolean;
    currentPointerCount(): number;
    getUnusedPointer(): Pointer | null;
    getPointerFromId(pointerId: number): Pointer | null;
    getlastRemovedPointerInput(): SinglePointerInput | DualPointerInput | null;
    onIdle(): void;
    /**
     * PointerEvent handlers
     * - the Pointer is always updated firs
     * - afterwards, the current activePointerInput is updated
     */
    onPointerMove(pointermoveEvent: PointerEvent): void;
    onPointerUp(pointerupEvent: PointerEvent): void;
    onPointerCancel(pointercancelEvent: PointerEvent): void;
}
type SinglePointerInputConstructor = new (...args: ConstructorParameters<typeof SinglePointerInput>) => SinglePointerInput;
type DualPointerInputConstructor = new (...args: ConstructorParameters<typeof DualPointerInput>) => DualPointerInput;
export const GestureEvent: {
    new (type: string, eventInitDict?: CustomEventInit<GestureEventData> | undefined): CustomEvent<GestureEventData>;
    prototype: CustomEvent<any>;
};
interface GestureOptions {
    DEBUG: boolean;
    blocks: Gesture[];
    bubbles: boolean;
    supportedDirections: string[];
}
interface GlobalGestureEventData {
    deltaX: number;
    deltaY: number;
    distance: number;
    speedX: number;
    speedY: number;
    speed: number;
    direction: Direction;
    scale: number;
    rotation: number;
    srcEvent: PointerEvent;
}
interface LiveGestureEventData {
    deltaX: number;
    deltaY: number;
    distance: number;
    speedX: number;
    speedY: number;
    speed: number;
    direction: Direction;
    scale: number;
    rotation: number;
    center: Point;
    srcEvent: PointerEvent;
}
interface GestureEventData extends TimedParameters {
    recognizer: Gesture;
    global: GlobalGestureEventData;
    live: LiveGestureEventData;
}
declare abstract class Gesture {
    validPointerManagerState: PointerManagerState | null;
    validPointerInputConstructor: SinglePointerInputConstructor | DualPointerInputConstructor;
    options: GestureOptions;
    DEBUG: boolean;
    eventBaseName: string;
    readonly domElement: HTMLElement;
    initialPointerEvent: PointerEvent | null;
    initialParameters: SinglePointerGestureParameters | DualPointerGestureParameters | null;
    activeStateParameters: SinglePointerGestureParameters | DualPointerGestureParameters | null;
    state: GestureState;
    constructor(domElement: HTMLElement, options?: Partial<GestureOptions>);
    getEmptyGestureParameters(): TimedMinMaxParameters;
    getGestureParameters(): SinglePointerGestureParameters | DualPointerGestureParameters;
    validateGestureParameters(pointerInput: SinglePointerInput | DualPointerInput): boolean;
    validateBooleanParameter(gestureParameter: boolean, pointerInputValue: boolean): boolean;
    validateMinMaxParameter(gestureParameter: number, pointerInputValue: number, minOrMax: string): boolean;
    validateDirection(pointerInput: SinglePointerInput | DualPointerInput): boolean;
    validateGestureState(): boolean;
    validatePointerManagerState(pointerManager: PointerManager): boolean;
    validatePointerInputConstructor(pointerInput: SinglePointerInput | DualPointerInput): boolean;
    validate(pointerManager: PointerManager): boolean;
    recognize(pointerManager: PointerManager): void;
    getPointerInput(pointerManager: PointerManager): SinglePointerInput | DualPointerInput | null;
    setInitialPointerEvent(pointerManager: PointerManager): void;
    emit(pointerManager: PointerManager, eventName?: string): void;
    onStart(pointerManager: PointerManager): void;
    onEnd(pointerManager: PointerManager): void;
    onTouchStart(event: TouchEvent): void;
    onTouchMove(event: TouchEvent): void;
    onTouchEnd(event: TouchEvent): void;
    onTouchCancel(event: TouchEvent): void;
    block(gesture: Gesture): void;
    unblock(gesture: Gesture): void;
    blockGestures(): void;
    unblockGestures(): void;
    getEventData(pointerInput: SinglePointerInput | DualPointerInput): GestureEventData;
}
declare abstract class SinglePointerGesture extends Gesture {
    initialPointerEvent: PointerEvent | null;
    initialParameters: SinglePointerGestureParameters;
    activeStateParameters: SinglePointerGestureParameters;
    constructor(domElement: HTMLElement, options?: Partial<GestureOptions>);
    getEventData(singlePointerInput: SinglePointerInput): GestureEventData;
}
interface TapOptions extends GestureOptions {
    maxDuration: number;
    maxDistance: number;
}
export class Tap extends SinglePointerGesture {
    constructor(domElement: HTMLElement, options?: Partial<TapOptions>);
    validate(pointerManager: PointerManager): boolean;
    onStart(pointerManager: PointerManager): void;
}
interface PressOptions extends GestureOptions {
    minDuration: number;
    maxDistance: number;
}
export class Press extends SinglePointerGesture {
    hasBeenEmitted: boolean;
    constructor(domElement: HTMLElement, options?: Partial<PressOptions>);
    recognize(pointerManager: PointerManager): void;
}
export class Pan extends SinglePointerGesture {
    swipeFinalSpeed: number;
    isSwipe: boolean;
    initialSupportedDirections: string[];
    constructor(domElement: HTMLElement, options?: Partial<GestureOptions>);
    validate(pointerManager: PointerManager): boolean;
    onStart(pointerManager: PointerManager): void;
    onEnd(pointerManager: PointerManager): void;
    onTouchMove(event: TouchEvent): void;
}
declare abstract class DualPointerGesture extends Gesture {
    initialPointerEvent_1: PointerEvent | null;
    initialPointerEvent_2: PointerEvent | null;
    initialParameters: DualPointerGestureParameters;
    activeStateParameters: DualPointerGestureParameters;
    constructor(domElement: HTMLElement, options?: Partial<GestureOptions>);
    getEventData(dualPointerInput: DualPointerInput): GestureEventData;
}
export class Pinch extends DualPointerGesture {
    constructor(domElement: HTMLElement, options?: Partial<GestureOptions>);
}
export class Rotate extends DualPointerGesture {
    constructor(domElement: HTMLElement, options?: Partial<GestureOptions>);
}
export class TwoFingerPan extends DualPointerGesture {
    constructor(domElement: HTMLElement, options?: Partial<GestureOptions>);
}
/**
 * pointerdownEvent ->  PointerListener.onPointerDown -> PointerManager.addPointer -> recognizeGestures (on move, idle, up, leave, cancel)
 * pointerupEvent -> PointerListener.onPointerUp -> PointerManager.onPointerUp -> Pointeristener.recognizeGestures
 */
type GestureConstructor = new (...args: ConstructorParameters<typeof Gesture>) => Gesture;
interface PointerListenerOptions {
    DEBUG: boolean;
    DEBUG_GESTURES: boolean;
    DEBUG_POINTERMANAGER: boolean;
    bubbles: boolean;
    handleTouchEvents: boolean;
    consecutiveGestures: boolean;
    simultaneousGestures: boolean;
    supportedGestures: (Gesture | GestureConstructor)[];
    pointerdown?: (event: PointerEvent, self: PointerListener) => void;
    pointermove?: (event: PointerEvent, self: PointerListener) => void;
    pointerup?: (event: PointerEvent, self: PointerListener) => void;
    pointercancel?: (event: PointerEvent, self: PointerListener) => void;
}
export class PointerListener {
    readonly options: PointerListenerOptions;
    DEBUG: boolean;
    state: PointerListenerState;
    activeGestures: Gesture[];
    constructor(domElement: HTMLElement, options?: Partial<PointerListenerOptions>);
    removePointerEventListeners(): void;
    addTouchEventListeners(): void;
    removeTouchEventListeners(): void;
    updateActiveGestures(gesture: Gesture): void;
    on(eventsString: string, handlerReference: EventListenerOrEventListenerObject): void;
    off(eventsString: string, handlerReference: EventListenerOrEventListenerObject): void;
    destroy(): void;
}

//# sourceMappingURL=index.d.ts.map
