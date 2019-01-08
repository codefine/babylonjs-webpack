import { Scene, Observer } from 'babylonjs';
import { AdvancedDynamicTexture, Rectangle, Control, TextBlock } from 'babylonjs-gui';

export default class FPSMonitor {
    
    private _advancedTexture: AdvancedDynamicTexture;
    private _fpsLabel: Rectangle;
    private _fpsText: TextBlock;
    private _observer: Observer<Scene>;
    private _isMobile: boolean = navigator.userAgent.toLowerCase().includes('mobile');

    constructor(private _scene: Scene, private _enabled: boolean = true) {
        this._advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('gui');
        this._fpsText = new TextBlock();
        this.createLabel();
        this._enabled && this.enable();
    }

    public get _fps(): number {
        return Number( this._scene.getEngine().getFps().toFixed() );
    }

    public get _colorOfStatus(): string {
        if (this._fps >= 45) {
            return '#03a9f4';
        }
        else if (this._fps >= 30 && this._fps < 45) {
            return '#ffc107';
        }
        else {
            return '#f44336';
        }
    }

    private get _labelStyles(): Object {
        return {
            background: this._colorOfStatus,
            width: this._isMobile ? '110px' : '60px',
            height: this._isMobile ? '40px' : '20px',
            alpha: 0.8,
            cornerRadius: this._isMobile ? 8 : 6,
            thickness: 0,
            left: this._isMobile ? '-20px' : '-10px',
            top: this._isMobile ? '20px' : '10px',
            fontSize: this._isMobile ? 26 : 13,
            fontFamily: this._isMobile ? 'Arial' : 'Verdana',
            hoverCursor: 'pointer',
            shadowColor: 'rgb(0, 0, 0, .4)',
            shadowBlur: this._isMobile ? 4 : 2,
            shadowOffsetX: 0,
            shadowOffsetY: this._isMobile ? 4 : 2,
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_RIGHT,
            verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP
        };
    }

    private get _textStyles(): Object {
        return {
            text: '60 FPS',
            color: 'white'
        };
    }

    private createLabel(): void {
        this._fpsLabel = new Rectangle('fps');
        this._fpsLabel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        Object.assign(this._fpsLabel, this._labelStyles);
        Object.assign(this._fpsText, this._textStyles);
        this._advancedTexture.addControl(this._fpsLabel);
        this._fpsLabel.addControl(this._fpsText);
        this._fpsLabel.onPointerClickObservable.add(() => {
            this.dispose();
        });
    }

    private update(): void {
        this._fpsText.text = this._fps + ' FPS';
        this._fpsLabel.background = this._colorOfStatus;
    }

    public enable(): void {
        this._fpsLabel.isEnabled = true;
        this._fpsLabel.isVisible = true;
        this._observer = < Observer<Scene> >this._scene.onBeforeRenderObservable.add(() => {
            this.update();
        });
    }

    public disable(): void {
        this._fpsLabel.isEnabled = false;
        this._fpsLabel.isVisible = false;
        this._observer && this._scene.onBeforeRenderObservable.remove(this._observer);
    }

    public dispose(): void {
        this._fpsLabel.clearControls();
        this._fpsLabel.dispose();
    }

}