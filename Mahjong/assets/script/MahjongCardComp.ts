import { _decorator, Component, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { MahjongCard } from './CardType';
import { CardSuit } from './CardType';

@ccclass('MahjongCardComp')
export class MahjongCardComp extends Component {
    @property(Sprite)
    cardSprite!: Sprite;

    @property([SpriteFrame])
    allCardFrames: SpriteFrame[] = [];

    public row = 0;
    public col = 0;
    public cardData!: MahjongCard;

    private frameMap: Map<string, SpriteFrame> = new Map();

    onLoad() {
        this.buildFrameMap();
        console.log("MahjongCardComp onLoad, 资源数量：", this.allCardFrames.length);
    }

    buildFrameMap() {
        this.frameMap.clear();
        for (const sf of this.allCardFrames) {
            this.frameMap.set(sf.name, sf);
        }
    }

    setCardData(data: MahjongCard) {
        this.cardData = data;
        console.log("setCardData被调用！suit=", data.suit, "num=", data.num);

        if (data.suit === CardSuit.WAN && [1, 2, 3, 5, 6, 7, 8, 9].includes(data.num)) {
            const key = `mj_wan_${data.num}`;
            const frame = this.frameMap.get(key);
            console.log("查找图片key：", key, "找到frame=", frame);
            if (frame) {
                this.cardSprite.spriteFrame = frame;
                console.log("✅贴图成功：", key);
            } else {
                console.warn("❌找不到图片key:", key, "全部keys:", Array.from(this.frameMap.keys()));
            }
        } else {
            console.warn("❌牌不在万子1,2,3,5,6,7,8,9范围内：", data);
        }
    }

    // 下落/交换动画
    playFall(targetPos: Vec3, duration: number): Promise<void> {
        return new Promise(resolve => {
            tween(this.node)
                .to(duration, { position: targetPos })
                .call(() => resolve())
                .start();
        })
    }

    // 消除消失动画
    playDestroyAni(): Promise<void> {
        return new Promise(resolve => {
            tween(this.node)
                .to(0.2, { scale: new Vec3(0,0,1) })
                .call(() => {
                    this.node.destroy();
                    resolve();
                })
                .start();
        })
    }
}
