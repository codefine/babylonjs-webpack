import * as BABYLON from 'babylonjs';

export default class Materials implements D.IMaterial {
    private _highLightLayer = new BABYLON.HighlightLayer('hl', this._scene);
    public floor: D.TMaterials = {};
    public temperature: D.TMaterials = {};
    constructor(private _scene: BABYLON.Scene) {
        this.initFloorMaterial();
        this.initTemperatureMaterial();
    }
    private initFloorMaterial() {
        this.floor.applyNormal = (node: BABYLON.Mesh) => {
            const diffuseColor = new BABYLON.Color3(72/255, 80/255, 87/255);
            const edgesColor = new BABYLON.Color4(0.1, 0.1, 0.1, .6);
            const normal = new BABYLON.StandardMaterial('floor-normal', this._scene);
            normal.diffuseColor = diffuseColor;
            normal.alpha = 0.2;
            node.material = normal;
            Materials.EdgesRendering(node, edgesColor);
        };
    }
    private initTemperatureMaterial() {
        this.temperature.applyLow = (node: BABYLON.Mesh) => {
            const diffuseColor = new BABYLON.Color3(66/255, 190/255, 255/255);
            const low = new BABYLON.StandardMaterial('temperature-low', this._scene);
            low.diffuseColor = diffuseColor;
            low.emissiveColor = diffuseColor;
            node.material = low;
            this._highLightLayer.addMesh(node, diffuseColor);
        };
        this.temperature.applyMiddle = (node: BABYLON.Mesh) => {
            const diffuseColor = new BABYLON.Color3(248/255, 168/255, 18/255);
            const middle = new BABYLON.StandardMaterial('temperature-middle', this._scene);
            middle.diffuseColor = diffuseColor;
            middle.emissiveColor = diffuseColor;
            node.material = middle;
            this._highLightLayer.addMesh(node, diffuseColor);
        };
        this.temperature.applyHigh = (node: BABYLON.Mesh) => {
            const diffuseColor = new BABYLON.Color3(245/255, 43/255, 56/255);
            const high = new BABYLON.StandardMaterial('temperature-high', this._scene);
            high.diffuseColor = diffuseColor;
            high.emissiveColor = diffuseColor;
            node.material = high;
            this._highLightLayer.addMesh(node, diffuseColor);
        };
        this.temperature.applyOffline = (node: BABYLON.Mesh) => {
            const offline = new BABYLON.StandardMaterial('temperature-offline', this._scene);
            offline.diffuseColor = new BABYLON.Color3(160/255, 160/255, 160/255);
            node.material = offline;
        };
    }
    public static EdgesRendering(node: BABYLON.Mesh, color: BABYLON.Color4, enabled: Boolean = true) {
        if (!enabled) {
            node.disableEdgesRendering();
        } else {
            node.enableEdgesRendering();
            node.edgesWidth = 2;
            node.edgesColor = color;
        }
    }
}