import { _decorator, Component, Node, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;
import { MahjongCard } from "./CardType";

@ccclass('MahjongCardComp')
export class MahjongCardComp extends Component {
    @property
    public cardData: MahjongCard|null = null;
    public row: number = 0;
    public col: number = 0;

    // 下落动画
    playFall(targetPos: Vec3, duration: number = 0.25) {
        return new Promise<void>(resolve=>{
            tween(this.node)
                .to(duration, {position: targetPos})
                .call(()=>resolve())
                .start();
        })
    }

    // 消除动画
    playDestroyAni() {
        return new Promise<void>(resolve=>{
            tween(this.node)
                .to(0.15, {scale: new Vec3(1.2,1.2,1)})
                .to(0.15, {scale: new Vec3(0,0,1)})
                .call(()=>{
                    this.node.destroy();
                    resolve();
                })
                .start();
        })
    }
}