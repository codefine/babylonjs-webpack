import * as BABYLON from 'babylonjs';
import Loader from './loader';
import Materials from './materials';
// @ts-ignore
import Data from '../mock';

export default class Creater {

    private _loader: D.ILoader = new Loader(this._scene);
    private _source: D.TSourceMesh = {};
    private _materials: D.IMaterial = new Materials(this._scene);

    constructor(private _scene: BABYLON.Scene) {
        this._loader.onLoad(() => {
            this._source = this._loader.models;
            this.compile(Data);
        });
    }

    get models() {
        return this._scene.getMeshesByTags('models');
    }

    get pipes() {
        return this._scene.getMeshesByTags('pipes');
    }

    private compile(data: {
        name: string,
        constructions: D.TConstruction[],
        exchangers: D.TExchanger[]
    }) {
        this.resetScene();
        const { name, constructions, exchangers } = data;
        if (constructions) {
            this.compileConstructions(constructions);
        }
    }

    private compileConstructions(data: D.TConstruction[]) {
        for (const construction of data) {
            const { name, position, rotation, valve, pipe, floors } = construction;
            const constructionNode = new BABYLON.TransformNode('construction-' + name, this._scene);
            constructionNode.position = BABYLON.Vector3.FromArray(position);
            constructionNode.rotation = BABYLON.Vector3.FromArray(rotation);
            this.compileFloors(floors, constructionNode);
        }
    }

    private compileFloors(data: D.TFloor[], parent: BABYLON.TransformNode) {
        const between = 0.1;
        for (let i = 0; i < data.length; i ++) {
            const { type, size, rooms } = data[i];
            const floorNode = this._source[`floor${type}`].clone(`floor-${i}`, parent);
            floorNode.scaling = this.computedVectorForReal(floorNode, size);
            floorNode.position.y += i * (size[1] + between);
            (<Function>this._materials.floor.applyNormal)(floorNode);
            Materials.EdgesRendering(floorNode, new BABYLON.Color4(0.1, 0.1, 0.1, .6));
            this.compileRooms(rooms, floorNode);
        }
    }

    private compileRooms(data: D.TRoom[], parent: BABYLON.Mesh) {
        for (const room of data) {
            const { name, size, offset, data } = room;
            const roomNode = BABYLON.MeshBuilder.CreateBox(name, {
                width: size[0],
                height: size[1],
                depth: size[2]
            }, this._scene);
            roomNode.scaling = BABYLON.Vector3.One().divide(parent.scaling);
            roomNode.position = this.computedVectorForRelative(parent.scaling, offset);
            roomNode.parent = parent;
            this.getTemperatureFunction(data)(roomNode);
        }
    }

    // 按照数据中的尺寸缩放原始模型，获取缩放值
    private computedVectorForReal(node: BABYLON.Mesh, vec: [number, number, number]): BABYLON.Vector3 {
        const { maximum, minimum } = node.getBoundingInfo();
        const originSize = [maximum.x - minimum.x, maximum.y - minimum.y, maximum.z - minimum.z];
        const scale = [vec[0] / originSize[0], vec[1] / originSize[1], vec[2] / originSize[2]];
        return BABYLON.Vector3.FromArray(scale);
    }

    // 根据父节点的缩放尺寸，还原数据中的尺寸(反向缩放)
    private computedVectorForRelative(scale: BABYLON.Vector3, vec: [number, number, number]) {
        const { x, y, z } = scale;
        vec[0] /= x;
        vec[1] /= y;
        vec[2] /= z;
        return BABYLON.Vector3.FromArray(vec);
    }

    private getTemperatureFunction(data: {
        temperature: number,
        status: number
    }): Function {
        const { temperature, status } = data;
        if (status === 1) {
            if (temperature < 16) {
                return <Function>this._materials.temperature.applyLow;
            } else if (temperature >= 16 && temperature < 25) {
                return <Function>this._materials.temperature.applyMiddle;
            } else {
                return <Function>this._materials.temperature.applyHigh;
            }
        }
        return <Function>this._materials.temperature.applyOffline;
    }

    private resetScene() {
        const needBeRemoved = [...this.models, ...this.pipes];
        for (const item of needBeRemoved) {
            this._scene.removeMesh(item, true);
        }
    }

}