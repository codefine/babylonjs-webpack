export default {
    "name": "小区名称",
    "constructions": [
        {
            "name": "一号楼一单元",
            "position": [0, 0, 0],
            "rotation": [0, 0, 0],
            "pipe": null, // 管线走向{ 数据结构待定 }
            "valve": {
                "type": 1, // 阀门类型{ 1=>串联 2=>并联 }
                "size": [0, 0, 0],
                "offset": [0, 0, 0],
                "rotation": [0, 0, 0],
                "data": {
                    "status": 1,
                    "temperature": 14,
                }
            },
            "floors": [
                {
                    "type": 1, // 楼层类型{ 1=>常规楼层 2=>楼顶 3=>... }
                    "size": [10, 2, 10],
                    "rooms": [
                        {
                            "name": "E-101",
                            "data": {
                                "status": 1,
                                "temperature": 14,
                            }, // 数据空间
                            "size": [2.5, 1.4, 3],
                            "offset": [2, 0, 2.2]
                        },
                        {
                            "name": "E-102",
                            "data": {
                                "status": 1,
                                "temperature": 18,
                            },
                            "size": [2.5, 1.4, 3],
                            "offset": [-2, 0, 2.2]
                        },
                        {
                            "name": "E-103",
                            "data": {
                                "status": 1,
                                "temperature": 26,
                            },
                            "size": [2.5, 1.4, 3],
                            "offset": [2, 0, -2.2]
                        },
                        {
                            "name": "E-104",
                            "data": {
                                "status": 0,
                                "temperature": 20,
                            },
                            "size": [2.5, 1.4, 3],
                            "offset": [-2, 0, -2.2]
                        }
                    ]
                }
            ]
        }
    ],
    "exchangers": [
        {
            "name": "高区换热站",
            "size": [0, 0, 0],
            "position": [0, 0, 0],
            "rotation": [0, 0, 0],
            "data": {} // 数据空间
        }
    ]
};