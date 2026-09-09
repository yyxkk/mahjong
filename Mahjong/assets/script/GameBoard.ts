import { _decorator, Component, Node, Prefab, instantiate, Vec3, Vec2, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import { MahjongCardComp } from './MahjongCardComp';
import { MahjongCardTouch } from './MahjongCardTouch';
import { CardSuit, MahjongCard } from './CardType';

@ccclass('GameBoard')
export class GameBoard extends Component {
    @property(Prefab)
    cardPrefab!: Prefab;
    @property(Node)
    boardRoot!: Node;

    readonly BOARD_SIZE = 5;
    board: (MahjongCardComp|null)[][] = [];
    eliminatedMap: Map<string, number> = new Map();
    isOperating = false; // 锁，防止动画中重复操作

    start() {
        this.initBoard();
    }

    // 判断三张牌是否可以消除：碰 OR 吃
    checkCanEliminate(c1:MahjongCard, c2:MahjongCard, c3:MahjongCard): boolean {
        // 碰：同花色同数字
        const isPeng = c1.suit === c2.suit && c2.suit === c3.suit && c1.num === c2.num && c2.num === c3.num;
        if(isPeng) return true;
        // 吃：同花色，非字牌，数字连续
        if(c1.suit === CardSuit.ZI) return false;
        if(c1.suit !== c2.suit || c2.suit !== c3.suit) return false;
        const arr = [c1.num, c2.num, c3.num].sort((a,b)=>a-b);
        if(arr[0]+1 === arr[1] && arr[1]+1 === arr[2]){
            return true;
        }
        return false;
    }

    // 初始化棋盘
    async initBoard() {
        this.board = Array(this.BOARD_SIZE).fill(0).map(()=>Array(this.BOARD_SIZE).fill(null));
        this.eliminatedMap.clear();
        for(let r=0;r<this.BOARD_SIZE;r++){
            for(let c=0;c<this.BOARD_SIZE;c++){
                await this.spawnCard(r,c);
            }
        }
        this.checkAndResolveMatch();
    }

    // 生成牌：根据消除记录动态权重
    spawnCard(row:number, col:number):Promise<MahjongCardComp>{
        return new Promise(resolve=>{
            const cardData = this.generateCardByWeight();
            const node = instantiate(this.cardPrefab);
            const comp = node.getComponent(MahjongCardComp)!;
            const touchComp = node.getComponent(MahjongCardTouch)!;
            touchComp.setBoardRef(this);

            comp.cardData = cardData;
            comp.row = row;
            comp.col = col;
            this.boardRoot.addChild(node);
            this.board[row][col] = comp;
            // 计算格子坐标
            const pos = this.getCellLocalPos(row, col);
            node.setPosition(pos);
            resolve(comp);
        })
    }

    // ========== 动态权重生成牌（难度核心） ==========
    generateCardByWeight(): MahjongCard {
        // 简单实现：根据eliminatedMap加权，解锁新牌
        const pool:string[] = [];
        // 基础池：万子1~3永远可用
        pool.push("wan_1","wan_2","wan_3");
        // 消除足够多后解锁更多牌
        const totalElim = Array.from(this.eliminatedMap.values()).reduce((a,b)=>a+b,0);
        if(totalElim > 10){
            pool.push("wan_4","wan_5");
        }
        if(totalElim >25){
            pool.push("wan_6","wan_7","wan_8","wan_9");
        }
        if(totalElim>40){
            pool.push("tong_1","tong_2","tong_3");
        }
        if(totalElim>60){
            pool.push("zi_1","zi_2","zi_3"); //字牌
        }
        // 加权：已经消除过的牌，增加出现概率
        for(const key of this.eliminatedMap.keys()){
            const cnt = this.eliminatedMap.get(key)!;
            for(let i=0;i<cnt;i++){
                pool.push(key);
            }
        }
        // 随机抽一个
        const selectedKey = pool[Math.floor(Math.random()*pool.length)];
        const [suit, numStr] = selectedKey.split("_");
        return {
            id: Math.random().toString(),
            suit: suit as CardSuit,
            num: Number(numStr)
        }
    }

    // ========== 拖拽交换两张牌 ==========
    async swapCard(r1:number,c1:number, r2:number,c2:number){
        if(this.isOperating) return;
        this.isOperating = true;
        const cardA = this.board[r1][c1];
        const cardB = this.board[r2][c2];
        if(!cardA || !cardB) {
            this.isOperating = false;
            return;
        }
        // 交换数据
        this.board[r1][c1] = cardB;
        this.board[r2][c2] = cardA;
        cardA.row = r2; cardA.col = c2;
        cardB.row = r1; cardB.col = c1;
        // 交换位置动画
        const posA = this.getCellLocalPos(r1,c1);
        const posB = this.getCellLocalPos(r2,c2);
        await Promise.all([
            cardA.playFall(posB,0.2),
            cardB.playFall(posA,0.2)
        ]);
        // 交换后检测消除
        await this.checkAndResolveMatch();
        this.isOperating = false;
    }

    // ========== 消除检测：查找所有满足吃/碰的三元组 ==========
    checkMatchGroups(): MahjongCardComp[][] {
        const result: MahjongCardComp[][] = [];
        const used = new Set<MahjongCardComp>();
        // 1. 扫描横向连续3格 [r,c] [r,c+1] [r,c+2]
        for(let r = 0; r < this.BOARD_SIZE; r++) {
            for(let c = 0; c <= this.BOARD_SIZE - 3; c++) {
                const c1 = this.board[r][c];
                const c2 = this.board[r][c+1];
                const c3 = this.board[r][c+2];
                if (!c1 || !c2 || !c3) continue;
                if(used.has(c1) || used.has(c2) || used.has(c3)) continue;
                if(this.checkCanEliminate(c1.cardData!, c2.cardData!, c3.cardData!)){
                    result.push([c1,c2,c3]);
                    used.add(c1);
                    used.add(c2);
                    used.add(c3);
                }
            }
        }
        // 2. 扫描纵向连续3格 [r,c] [r+1,c] [r+2,c]
        for(let r = 0; r <= this.BOARD_SIZE -3; r++) {
            for(let c = 0; c < this.BOARD_SIZE; c++) {
                const c1 = this.board[r][c];
                const c2 = this.board[r+1][c];
                const c3 = this.board[r+2][c];
                if (!c1 || !c2 || !c3) continue;
                if(used.has(c1) || used.has(c2) || used.has(c3)) continue;
                if(this.checkCanEliminate(c1.cardData!, c2.cardData!, c3.cardData!)){
                    result.push([c1,c2,c3]);
                    used.add(c1);
                    used.add(c2);
                    used.add(c3);
                }
            }
        }
        return result;
    }

    // ========== 执行消除，下落，补牌 ==========
    async checkAndResolveMatch(){
        const groups = this.checkMatchGroups();
        if(groups.length ===0) return;
        // 收集所有要消除的牌
        const delCards = groups.flat();
        // 更新消除统计
        for(const comp of delCards){
            const key = `${comp.cardData!.suit}_${comp.cardData!.num}`;
            this.eliminatedMap.set(key, (this.eliminatedMap.get(key)||0)+1);
        }
        // 播放消除动画
        await Promise.all(delCards.map(c=>c.playDestroyAni()));
        // 清空棋盘空位
        for(const comp of delCards){
            this.board[comp.row][comp.col] = null;
        }
        // 牌下落：逐列处理，下方填充
        await this.doCardFall();
        // 顶部生成新牌填充空位
        await this.fillEmptyTop();
        // 递归继续检测（消除后新牌下落可能连锁消除）
        await this.checkAndResolveMatch();
    }

    // 列内牌向下掉落
    async doCardFall(){
        for(let col=0;col<5;col++){
            const validCards: MahjongCardComp[] = [];
            // 收集本列非空牌
            for(let row=0;row<5;row++){
                const c = this.board[row][col];
                if(c) validCards.push(c);
            }
            // 从最下面一行回填
            let writeRow = 4;
            const tasks:Promise<void>[] = [];
            for(let i=validCards.length-1; i>=0; i--){
                const card = validCards[i];
                const oldR = card.row;
                card.row = writeRow;
                this.board[writeRow][col] = card;
                this.board[oldR][col] = null;
                tasks.push(card.playFall(this.getCellLocalPos(card.row, col),0.25));
                writeRow--;
            }
            await Promise.all(tasks);
        }
    }

    // 顶部空位生成新牌
    async fillEmptyTop(){
        for(let col=0;col<5;col++){
            for(let row=0;row<5;row++){
                if(this.board[row][col] === null){
                    const newCard = await this.spawnCard(row, col);
                    newCard.node.setPosition(this.getCellLocalPos(-1, col)); // 屏幕外顶部
                    await newCard.playFall(this.getCellLocalPos(row, col),0.3);
                }
            }
        }
    }

    // 取得相對於 boardRoot 的本地座標（UI專用，修正座標錯亂）
    getCellLocalPos(row:number, col:number): Vec3 {
        const cellW = 100;
        const cellH = 120;
        const offsetX = -(this.BOARD_SIZE-1)*cellW/2;
        const offsetY = (this.BOARD_SIZE-1)*cellH/2;
        return new Vec3(offsetX + col*cellW, offsetY - row*cellH, 0);
    }

    getCardByScreenPos(screenPos: Vec2): MahjongCardComp | null {
        // 把屏幕座標轉成 boardRoot 的本地座標
        const uiTrans = this.boardRoot.getComponent(UITransform)!;
        const localPos = uiTrans.convertToNodeSpaceAR(screenPos);
        for(let r = 0; r < this.BOARD_SIZE; r++) {
            for(let c = 0; c < this.BOARD_SIZE; c++) {
                const card = this.board[r][c];
                if (!card) continue;
                const cardTrans = card.node.getComponent(UITransform)!;
                const rect = cardTrans.getBoundingBox();
                if(rect.contains(new Vec2(localPos.x, localPos.y))){
                    return card;
                }
            }
        }
        return null;
    }
}
