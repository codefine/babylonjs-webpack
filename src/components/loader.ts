import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
// @ts-ignore
import MODELS_MAP from '../models_map.json';

export default class Loader implements D.ILoader {

    private _engine: BABYLON.Engine;
    private _manager: BABYLON.AssetsManager;
    private _emitter: Function;
    public models: D.TSourceMesh = {};

    constructor(private _scene: BABYLON.Scene) {
        this._engine = this._scene.getEngine();
        this.initLoadingUI();
        this.initManager();
    }

    private initLoadingUI() {
        this._engine.loadingUIText = 'Loading...';
    }

    private loadMesh(name: string) {
        const meshTask = this._manager.addMeshTask('load ' + name, null, 'assets/models/', name + '.obj');
        meshTask.onSuccess = (task: BABYLON.MeshAssetTask) => {
            const { loadedMeshes: [mesh] } = task;
            BABYLON.Tags.AddTagsTo(mesh, 'models');
            this.models[mesh.name] = mesh as BABYLON.Mesh;
        };
    }

    private initManager() {
        const assetsManager = new BABYLON.AssetsManager(this._scene);
        this._manager = assetsManager;
        assetsManager.onProgressObservable.add((task) => {
            const { remainingCount, totalCount } = task;
            this._engine.loadingUIText = 'We are loading the scene. ' + remainingCount + ' out of ' + totalCount + ' items still need to be loaded.';
        });
        assetsManager.onTasksDoneObservable.add(() => {
            this._emitter && this._emitter();
        });
        for (const key of Object.keys(MODELS_MAP)) {
            this.loadMesh(key);
        }
        this._manager.load();
    }

    public onLoad(callback: Function) {
        this._emitter = callback;
    }

}