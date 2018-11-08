import * as BABYLON from 'babylonjs';
import { AddLabelToMesh } from './gui';

export default class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camrea: BABYLON.FreeCamera;
    private _light: BABYLON.Light;

    constructor(canvasElement: string) {
        this._canvas = document.querySelector(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene(): void {
        this._scene = new BABYLON.Scene(this._engine);

        this._camrea = new BABYLON.FreeCamera(
            'freeCamera-1',
            new BABYLON.Vector3(0, 5, -10),
            this._scene
        );
        this._camrea.setTarget(BABYLON.Vector3.Zero());
        this._camrea.attachControl(this._canvas, false);

        this._light = new BABYLON.HemisphericLight(
            'hsLight-1',
            new BABYLON.Vector3(0, 1, 0),
            this._scene
        );
        
        const sphere = BABYLON.MeshBuilder.CreateSphere(
            'sphere-1',
            {
                segments: 16,
                diameter: 2
            },
            this._scene
        );
        sphere.position.y = 1;
        new AddLabelToMesh(sphere);

        const ground = BABYLON.MeshBuilder.CreateGround(
            'ground-1',
            {
                width: 6,
                height: 6,
                subdivisions: 2
            },
            this._scene
        );
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