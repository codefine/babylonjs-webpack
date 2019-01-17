/// <reference path="../index.d.ts" />
import * as BABYLON from 'babylonjs';
import Creater from './creater';

export default class Engine {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;
    private _creater: D.ICreater;

    constructor(canvasElement: string) {
        this._canvas = document.querySelector(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true, {}, true);
        this._scene = new BABYLON.Scene(this._engine);
        this._creater = new Creater(this._scene);
        this.createBasicEnv();
    }

    createBasicEnv(): void {
        const hLight = new BABYLON.HemisphericLight('hLight', new BABYLON.Vector3(0, 1, 0), this._scene);
        hLight.diffuse = new BABYLON.Color3(0.3, 0.3, 0.3)
        // const lightPos = new BABYLON.Vector3(100, 100, 100);
        // const spotLight = new BABYLON.SpotLight('sLight', lightPos, new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 20, this._scene);

        this._camera = new BABYLON.ArcRotateCamera(
            'arcam',
            Math.PI / 2,
            Math.PI / 4,
            20,
            BABYLON.Vector3.Zero(),
            this._scene
        );
        // this._camera.upperBetaLimit = Math.PI / 2;
        // this._camera.lowerRadiusLimit = 5;
        // this._camera.upperRadiusLimit = 30;
        this._camera.attachControl(this._canvas, false);

    }

    doRender(): void {
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
        window.addEventListener('resize', () => {
            this._engine.resize();
        })
    }

}