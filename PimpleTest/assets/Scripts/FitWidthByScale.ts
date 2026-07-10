import { _decorator, Component, Sprite, UITransform, view, Node } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('FitWidthByScale')
@executeInEditMode(true) // 编辑器里实时生效
export class FitWidthByScale extends Component {

    private _uiTransform: UITransform;
    private _sprite: Sprite;

    @property(Node) canvas: Node = null;

    onLoad() {
        this._uiTransform = this.node.getComponent(UITransform)!;
        this._sprite = this.node.getComponent(Sprite)!;
        this.fit();
    }

    onEnable() {
        this.fit();
    }

    // 核心：只改 scale，不改尺寸，保持图片原始比例
    fit() {
        const sf = this._sprite.spriteFrame;
        if (!sf) return;

        // 1. 图片原始真实宽高
        const originalWidth = sf.width;
        const originalHeight = sf.height;

        // 2. 目标宽度 = 父节点宽度（全屏就放Canvas下）
        const targetWidth = this.canvas.getComponent(UITransform)!.width;

        // 3. 计算等比缩放值（只按宽度算）
        const scale = targetWidth / originalWidth / 3;

        // 4. 关键：x/y 用同一个 scale → 绝对不变形
        this.node.setScale(scale, scale);
    }
}