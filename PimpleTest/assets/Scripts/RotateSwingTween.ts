import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RotateSwingTween')
export class RotateSwingTween extends Component {
    onLoad() {
        // 从 0° 到 45° 再到 -45° 无限来回
        tween(this.node)
            .to(1, { eulerAngles: new Vec3(0, 0, 45) }, { easing: 'smooth' })
            .to(1, { eulerAngles: new Vec3(0, 0, -45) }, { easing: 'smooth' })
            .union()
            .repeatForever()
            .start();
    }
}