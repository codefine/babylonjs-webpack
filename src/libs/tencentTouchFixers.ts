import {
    ICameraInput,
    PointerEventTypes,
    PointerInfo,
    EventState,
    Nullable,
    Observer,
    Tools,
    ArcRotateCamera
} from 'babylonjs';

const __decoratorInitialStore = {};

function getDirectStore(target: any): any {
    const classKey = target.getClassName();
    if (!(<any>__decoratorInitialStore)[classKey]) {
        (<any>__decoratorInitialStore)[classKey] = {};
    }
    return (<any>__decoratorInitialStore)[classKey];
}

function generateSerializableMember(type: number, sourceName?: string) {
    return (target: any, propertyKey: string | symbol) => {
        const classStore = getDirectStore(target);
        if (!classStore[propertyKey]) {
            classStore[propertyKey] = { type: type, sourceName: sourceName };
        }
    };
}

function serialize(sourceName?: string) {
    return generateSerializableMember(0, sourceName); // value member
}

class ArcRotateCameraPointersInput implements ICameraInput<ArcRotateCamera> {
    public camera: ArcRotateCamera;

    @serialize()
    public buttons = [0, 1, 2];

    @serialize()
    public angularSensibilityX = 1000.0;

    @serialize()
    public angularSensibilityY = 1000.0;

    @serialize()
    public pinchPrecision = 12.0;

    @serialize()
    public pinchDeltaPercentage = 0;

    @serialize()
    public panningSensibility: number = 1000.0;

    @serialize()
    public multiTouchPanning: boolean = true;

    @serialize()
    public multiTouchPanAndZoom: boolean = true;

    public pinchInwards = true;
    private _isPanClick: boolean = false;
    private _pointerInput: (p: PointerInfo, s: EventState) => void;
    private _observer: Nullable<Observer<PointerInfo>>;
    private _onMouseMove: Nullable<(e: MouseEvent) => any>;
    private _onGestureStart: Nullable<(e: PointerEvent) => void>;
    private _onGesture: Nullable<(e: MSGestureEvent) => void>;
    private _MSGestureHandler: Nullable<MSGesture>;
    private _onLostFocus: Nullable<(e: FocusEvent) => any>;
    private _onContextMenu: Nullable<(e: Event) => void>;

    public attachControl(element: HTMLElement, noPreventDefault?: boolean): void {
        const engine = this.camera.getEngine();
        let cacheSoloPointer: Nullable<{ x: number, y: number, pointerId: number, type: any }>; // cache pointer object for better perf on camera rotation
        let pointA: Nullable<{ x: number, y: number, pointerId: number, type: any }> = null;
        let pointB: Nullable<{ x: number, y: number, pointerId: number, type: any }> = null;
        let previousPinchSquaredDistance = 0;
        let initialDistance = 0;
        let twoFingerActivityCount = 0;
        const previousMultiTouchPanPosition: { x: number, y: number, isPaning: boolean, isPinching: boolean } = { x: 0, y: 0, isPaning: false, isPinching: false };

        this._pointerInput = (p, s) => {
            const evt = <PointerEvent>p.event;
            const isTouch = (<any>p.event).pointerType === "touch";
            if (typeof evt.pointerId === 'undefined') {
                return;
            }
            if (engine.isInVRExclusivePointerMode) {
                return;
            }
            if (p.type !== PointerEventTypes.POINTERMOVE && this.buttons.indexOf(evt.button) === -1) {
                return;
            }
            let srcElement = <HTMLElement>(evt.srcElement || evt.target);
            if (p.type === PointerEventTypes.POINTERDOWN && srcElement) {
                try {
                    srcElement.setPointerCapture(evt.pointerId);
                } catch (e) {
                    // return;
                }
                this._isPanClick = evt.button === this.camera._panningMouseButton;
                cacheSoloPointer = { x: evt.clientX, y: evt.clientY, pointerId: evt.pointerId, type: evt.pointerType };
                if (pointA === null) {
                    pointA = cacheSoloPointer;
                }
                else if (pointB === null) {
                    pointB = cacheSoloPointer;
                }
                if (!noPreventDefault) {
                    evt.preventDefault();
                    element.focus();
                }
            }
            else if (p.type === PointerEventTypes.POINTERDOUBLETAP) {
                if (this.camera.useInputToRestoreState) {
                    this.camera.restoreState();
                }
            }
            else if (p.type === PointerEventTypes.POINTERUP && srcElement) {
                try {
                    srcElement.releasePointerCapture(evt.pointerId);
                } catch (e) {
                }
                cacheSoloPointer = null;
                previousPinchSquaredDistance = 0;
                previousMultiTouchPanPosition.isPaning = false;
                previousMultiTouchPanPosition.isPinching = false;
                twoFingerActivityCount = 0;
                initialDistance = 0;
                if (!isTouch) {
                    pointB = null;
                }
                if (engine._badOS) {
                    pointA = pointB = null;
                }
                else {
                    if (pointB && pointA && pointA.pointerId == evt.pointerId) {
                        pointA = pointB;
                        pointB = null;
                        cacheSoloPointer = { x: pointA.x, y: pointA.y, pointerId: pointA.pointerId, type: evt.pointerType };
                    }
                    else if (pointA && pointB && pointB.pointerId == evt.pointerId) {
                        pointB = null;
                        cacheSoloPointer = { x: pointA.x, y: pointA.y, pointerId: pointA.pointerId, type: evt.pointerType };
                    }
                    else {
                        pointA = pointB = null;
                    }
                }
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            } else if (p.type === PointerEventTypes.POINTERMOVE) {
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
                if (pointA && pointB === null && cacheSoloPointer) {
                    if (this.panningSensibility !== 0 &&
                        ((evt.ctrlKey && this.camera._useCtrlForPanning) || this._isPanClick)) {
                        this.camera.inertialPanningX += -(evt.clientX - cacheSoloPointer.x) / this.panningSensibility;
                        this.camera.inertialPanningY += (evt.clientY - cacheSoloPointer.y) / this.panningSensibility;
                    } else {
                        const offsetX = evt.clientX - cacheSoloPointer.x;
                        const offsetY = evt.clientY - cacheSoloPointer.y;
                        this.camera.inertialAlphaOffset -= offsetX / this.angularSensibilityX;
                        this.camera.inertialBetaOffset -= offsetY / this.angularSensibilityY;
                    }
                    cacheSoloPointer.x = evt.clientX;
                    cacheSoloPointer.y = evt.clientY;
                }
                else if (pointA && pointB) {
                    const ed = (pointA.pointerId === evt.pointerId) ? pointA : pointB;
                    ed.x = evt.clientX;
                    ed.y = evt.clientY;
                    const direction = this.pinchInwards ? 1 : -1;
                    const distX = pointA.x - pointB.x;
                    const distY = pointA.y - pointB.y;
                    const pinchSquaredDistance = (distX * distX) + (distY * distY);
                    const pinchDistance = Math.sqrt(pinchSquaredDistance);
                    if (previousPinchSquaredDistance === 0) {
                        initialDistance = pinchDistance;
                        previousPinchSquaredDistance = pinchSquaredDistance;
                        previousMultiTouchPanPosition.x = (pointA.x + pointB.x) / 2;
                        previousMultiTouchPanPosition.y = (pointA.y + pointB.y) / 2;
                        return;
                    }
                    if (this.multiTouchPanAndZoom) {
                        if (this.pinchDeltaPercentage) {
                            this.camera.inertialRadiusOffset += ((pinchSquaredDistance - previousPinchSquaredDistance) * 0.001) * this.camera.radius * this.pinchDeltaPercentage;
                        } else {
                            this.camera.inertialRadiusOffset += (pinchSquaredDistance - previousPinchSquaredDistance) /
                                (this.pinchPrecision *
                                    ((this.angularSensibilityX + this.angularSensibilityY) / 2) *
                                    direction);
                        }
                        if (this.panningSensibility !== 0) {
                            const pointersCenterX = (pointA.x + pointB.x) / 2;
                            const pointersCenterY = (pointA.y + pointB.y) / 2;
                            const pointersCenterDistX = pointersCenterX - previousMultiTouchPanPosition.x;
                            const pointersCenterDistY = pointersCenterY - previousMultiTouchPanPosition.y;
                            previousMultiTouchPanPosition.x = pointersCenterX;
                            previousMultiTouchPanPosition.y = pointersCenterY;
                            this.camera.inertialPanningX += -(pointersCenterDistX) / (this.panningSensibility);
                            this.camera.inertialPanningY += (pointersCenterDistY) / (this.panningSensibility);
                        }
                    }
                    else {
                        twoFingerActivityCount++;
                        if (previousMultiTouchPanPosition.isPinching || (twoFingerActivityCount < 20 && Math.abs(pinchDistance - initialDistance) > this.camera.pinchToPanMaxDistance)) {
                            if (this.pinchDeltaPercentage) {
                                this.camera.inertialRadiusOffset += ((pinchSquaredDistance - previousPinchSquaredDistance) * 0.001) * this.camera.radius * this.pinchDeltaPercentage;
                            } else {
                                this.camera.inertialRadiusOffset += (pinchSquaredDistance - previousPinchSquaredDistance) /
                                    (this.pinchPrecision *
                                        ((this.angularSensibilityX + this.angularSensibilityY) / 2) *
                                        direction);
                            }
                            previousMultiTouchPanPosition.isPaning = false;
                            previousMultiTouchPanPosition.isPinching = true;
                        }
                        else {
                            if (cacheSoloPointer && cacheSoloPointer.pointerId === ed.pointerId && this.panningSensibility !== 0 && this.multiTouchPanning) {
                                if (!previousMultiTouchPanPosition.isPaning) {
                                    previousMultiTouchPanPosition.isPaning = true;
                                    previousMultiTouchPanPosition.isPinching = false;
                                    previousMultiTouchPanPosition.x = ed.x;
                                    previousMultiTouchPanPosition.y = ed.y;
                                    return;
                                }
                                this.camera.inertialPanningX += -(ed.x - previousMultiTouchPanPosition.x) / (this.panningSensibility);
                                this.camera.inertialPanningY += (ed.y - previousMultiTouchPanPosition.y) / (this.panningSensibility);
                            }
                        }
                        if (cacheSoloPointer && cacheSoloPointer.pointerId === evt.pointerId) {
                            previousMultiTouchPanPosition.x = ed.x;
                            previousMultiTouchPanPosition.y = ed.y;
                        }
                    }
                    previousPinchSquaredDistance = pinchSquaredDistance;
                }
            }
        };
        this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, PointerEventTypes.POINTERDOWN | PointerEventTypes.POINTERUP | PointerEventTypes.POINTERMOVE | PointerEventTypes.POINTERDOUBLETAP);
        this._onContextMenu = (evt) => {
            evt.preventDefault();
        };
        if (!this.camera._useCtrlForPanning) {
            element.addEventListener("contextmenu", this._onContextMenu, false);
        }
        this._onLostFocus = () => {
            pointA = pointB = null;
            previousPinchSquaredDistance = 0;
            previousMultiTouchPanPosition.isPaning = false;
            previousMultiTouchPanPosition.isPinching = false;
            twoFingerActivityCount = 0;
            cacheSoloPointer = null;
            initialDistance = 0;
        };
        this._onMouseMove = (evt) => {
            if (!engine.isPointerLock) {
                return;
            }
            const offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
            const offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
            this.camera.inertialAlphaOffset -= offsetX / this.angularSensibilityX;
            this.camera.inertialBetaOffset -= offsetY / this.angularSensibilityY;
            if (!noPreventDefault) {
                evt.preventDefault();
            }
        };
        this._onGestureStart = (e) => {
            if (window.MSGesture === undefined) {
                return;
            }
            if (!this._MSGestureHandler) {
                this._MSGestureHandler = new MSGesture();
                this._MSGestureHandler.target = element;
            }
            this._MSGestureHandler.addPointer(e.pointerId);
        };
        this._onGesture = (e) => {
            this.camera.radius *= e.scale;
            if (e.preventDefault) {
                if (!noPreventDefault) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        };

        element.addEventListener("mousemove", this._onMouseMove, false);
        element.addEventListener("MSPointerDown", <EventListener>this._onGestureStart, false);
        element.addEventListener("MSGestureChange", <EventListener>this._onGesture, false);
        Tools.RegisterTopRootEvents([
            { name: "blur", handler: this._onLostFocus }
        ]);
    }

    public detachControl(element: Nullable<HTMLElement>): void {
        if (this._onLostFocus) {
            Tools.UnregisterTopRootEvents([
                { name: "blur", handler: this._onLostFocus }
            ]);
        }
        if (element && this._observer) {
            this.camera.getScene().onPointerObservable.remove(this._observer);
            this._observer = null;
            if (this._onContextMenu) {
                element.removeEventListener("contextmenu", this._onContextMenu);
            }
            if (this._onMouseMove) {
                element.removeEventListener("mousemove", this._onMouseMove);
            }
            if (this._onGestureStart) {
                element.removeEventListener("MSPointerDown", <EventListener>this._onGestureStart);
            }
            if (this._onGesture) {
                element.removeEventListener("MSGestureChange", <EventListener>this._onGesture);
            }
            this._isPanClick = false;
            this.pinchInwards = true;
            this._onMouseMove = null;
            this._onGestureStart = null;
            this._onGesture = null;
            this._MSGestureHandler = null;
            this._onLostFocus = null;
            this._onContextMenu = null;
        }
    }

    public getClassName(): string {
        return "ArcRotateCameraPointersInput";
    }

    public getSimpleName(): string {
        return "pointers";
    }
}

export function arcRotateCameraFixer(camera: ArcRotateCamera): void {
    camera.inputs.removeByType('ArcRotateCameraPointersInput');
    camera.inputs.add(new ArcRotateCameraPointersInput());
}