import { AbstractMesh } from 'babylonjs';
import { AdvancedDynamicTexture, Rectangle, Control, TextBlock } from 'babylonjs-gui';

export class AddLabelToMesh {

    private _label: Rectangle;
    private _text: TextBlock;
    private _advancedTexture: AdvancedDynamicTexture;

    constructor(mesh: AbstractMesh) {
        if (!this._advancedTexture) {
            this.init();
        }
        this.add(mesh);
    }

    init(): void {
        if (!this._advancedTexture) {
            this._advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('ui1');
        }
    }

    add(mesh: AbstractMesh): void {
        const label: Rectangle = new Rectangle('label for ' + mesh.name);
        label.background = 'black';
        label.width = '100px';
        label.height = '30px';
        label.alpha = 0.5;
        label.cornerRadius = 20;
        label.thickness = 1;
        label.linkOffsetY = 30;
        label.top = '10%';
        label.zIndex = 5;
        label.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._advancedTexture.addControl(label);
        
        const text: TextBlock = new TextBlock();
        text.text = mesh.name;
        text.color = 'white';
        label.addControl(text);

        this._label = label;
        this._text = text;
    }

}