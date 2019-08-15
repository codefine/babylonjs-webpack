import * as BABYLON from '@babylonjs/core';
import FPSMonitor from '../libs/fpsMonitor';

export default class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;

    constructor(canvasElement: string) {
        // Create Engine, Scene
        // 创建引擎, 场景
        this._canvas = document.querySelector(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true, {}, true);
        this._scene = new BABYLON.Scene(this._engine);
        new FPSMonitor(this._scene);
        this.createBasicEnv();
    }

    // create environment with some basic webgl elements
    // 用一些基础的webgl元素创建环境
    createBasicEnv(): void {

        // Create Lights
        // 创建灯光
        new BABYLON.HemisphericLight('hLight', new BABYLON.Vector3(-1, -1, -1), this._scene);
        const lightPos = new BABYLON.Vector3(5, 5, 5);
        const spotLight = new BABYLON.SpotLight('sLight', lightPos, new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 20, this._scene);
        const spotLightMesh = BABYLON.MeshBuilder.CreateSphere('lightMesh', { diameter: 0.2 }, this._scene);
        spotLightMesh.position = lightPos;

        // Create Camera
        // 创建相机
        this._camera = new BABYLON.ArcRotateCamera(
            'arcam',
            0,
            Math.PI / 4,
            20,
            BABYLON.Vector3.Zero(),
            this._scene
        );
        this._camera.upperBetaLimit = Math.PI / 2;
        this._camera.lowerRadiusLimit = 5;
        this._camera.upperRadiusLimit = 30;
        this._camera.attachControl(this._canvas, false);

        // Create loading manager
        // 创建加载管理器
        const assetsManager = new BABYLON.AssetsManager(this._scene);
        assetsManager.addTextureTask('ground-diffuse-texture', 'assets/textures/ground.jpg');
        assetsManager.addTextureTask('ground-heightMap-texture', 'assets/textures/heightMap.png');
        this._engine.loadingUIText = 'Loading...';
        assetsManager.onProgressObservable.add((task) => {
            const { remainingCount, totalCount } = task;
            this._engine.loadingUIText = 'We are loading the scene. ' + remainingCount + ' out of ' + totalCount + ' items still need to be loaded.';
        });
        assetsManager.load();
        
        // Create Ground from HeightMap
        // 通过高度贴图创建地面
        const groundMat = new BABYLON.StandardMaterial('ground-material', this._scene);
        const diffuseTexture = new BABYLON.Texture('assets/textures/ground.jpg', this._scene);
        diffuseTexture.uScale = 6;
        diffuseTexture.vScale = 6;
        groundMat.diffuseTexture = diffuseTexture;
        groundMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap('ground', 'assets/textures/heightMap.png', {
            width: 10,
            height: 10,
            subdivisions: 32,
            minHeight: 0,
            maxHeight: 1
        }, this._scene);
        ground.material = groundMat;

        // Light Animation
        // 灯光动画
        let alpha = 0;
        this._scene.onBeforeRenderObservable.add(() => {
            alpha += 0.01;
            const pos = new BABYLON.Vector3(
                Math.cos(alpha),
                5,
                Math.sin(alpha)
            );
            spotLight.position = pos;
            spotLightMesh.position = pos;
        });

    }

    // do render loop and auto-resize
    // 循环以及自适应
    doRender(): void {
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
        window.addEventListener('resize', () => {
            this._engine.resize();
        })
    }

}