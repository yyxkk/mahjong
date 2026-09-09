import { _decorator, Component, Node, EventTouch, Vec2, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import { GameBoard } from './GameBoard';
import { MahjongCardComp } from './MahjongCardComp';

@ccclass('MahjongCardTouch')
export class MahjongCardTouch extends Component {
    private board!: GameBoard;
    private cardComp!: MahjongCardComp;
    private isDrag = false;
    private startPos = new Vec2();

    setBoardRef(board: GameBoard) {
        this.board = board;
        this.cardComp = this.node.getComponent(MahjongCardComp)!;
    }

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(evt: EventTouch) {
        evt.propagationStopped = true;
        this.isDrag = true;
        this.startPos = evt.getUILocation();
    }

    onTouchMove(evt: EventTouch) {
        if (!this.isDrag) return;
        const touchPos = evt.getUILocation();
        // ========== 修复这一行！==========
        const parentNode = this.node.getParent()!;
        const parentUITrans = parentNode.getComponent(UITransform)!;
        const localPos = parentUITrans.convertToNodeSpaceAR(touchPos);
        this.node.setPosition(localPos.x, localPos.y);
    }

    onTouchEnd(evt: EventTouch) {
        if (!this.isDrag) return;
        this.isDrag = false;
        const endPos = evt.getUILocation();
        const targetCard = this.board.getCardByScreenPos(endPos);
        // 如果拖拽到另一张牌，交换
        if (targetCard && targetCard !== this.cardComp) {
            this.board.swapCard(this.cardComp.row, this.cardComp.col, targetCard.row, targetCard.col);
        } else {
            // 拖到空白区域，回到原位
            const targetWorldPos = this.board.getCellLocalPos(this.cardComp.row, this.cardComp.col);
            this.node.setPosition(targetWorldPos);
        }
    }
}
