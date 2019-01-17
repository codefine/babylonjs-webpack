declare namespace D {

    interface ILoader {

        /** 已经加载完毕的模型 */
        models: {
            [prop: string]: BABYLON.Mesh;
        };

        /** 静态资源加载完毕 */
        onLoad: (callback: Function) => void;

    }

    interface ICreater {}

    interface IMaterial {
        floor: TMaterials;
        temperature: TMaterials;
    }

    type TMaterials = {
        [name: string]: BABYLON.Material | Function
    }

    type TSourceMesh = {
        [name: string]: BABYLON.Mesh
    }

    type TRoom = {
        name: string,
        data: {
            temperature: number,
            status: number,
            // [prop: string]: any
        },
        size: [number, number, number],
        offset: [number, number, number]
    }

    type TFloor = {
        type: number,
        size: [number, number, number],
        rooms: TRoom[]
    }

    type TValve = {
        type: number,
        size: [number, number, number],
        offset: [number, number, number],
        rotation: [number, number, number]
    }

    /**
     * 建筑物数据解构
     * @param name 名称
     * @param position 位置
     * @param rotation 旋转
     * @param valve 阀门信息
     * @param pipe 管线信息
     * @param floors 楼层信息
     */
    type TConstruction = {
        name: string,
        position: [number, number, number],
        rotation: [number, number, number],
        valve: TValve,
        pipe: [number, number, number][],
        floors: TFloor[]
    }

    type TExchanger = {
        name: string,
        data: {
            [prop: string]: any
        },
        size: [number, number, number],
        position: [number, number, number],
        rotation: [number, number, number]
    }

}