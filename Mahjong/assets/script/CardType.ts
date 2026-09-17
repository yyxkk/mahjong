// CardType.ts
/**
 * 牌类型分类
 */
export enum CardSuit {
    // 序数牌
    WAN = "wan",
    TIAO = "tiao",
    TONG = "tong",
    // 字牌
    DONG = "dong",
    NAN = "nan",
    XI = "xi",
    BEI = "bei",
    ZHONG = "zhong",
    FA = "fa",
    BAI = "bai",
}

export class MahjongCard {
    suit: CardSuit;
    rank: number; // 序数牌：1~9；字牌：东=1,南=2,西=3,北=4,中=5,发=6,白=7
    constructor(suit: CardSuit, rank: number) {
        this.suit = suit;
        this.rank = rank;
    }

    /** 判断两张牌完全相同（碰） */
    equal(other: MahjongCard): boolean {
        return this.suit === other.suit && this.rank === other.rank;
    }

    /**
     * 判断三张是否满足【吃】
     * 两种情况：
     * 1. 万/筒/条：同花色，点数连续（如1万2万3万）
     * 2. 字牌：任意字牌，rank连续（东1南2西3）
     */
    static isSequence(a: MahjongCard, b: MahjongCard, c: MahjongCard): boolean {
        const suitList = [a.suit, b.suit, c.suit];
        const isZiPai = (s: CardSuit) => {
            return s === CardSuit.DONG || s === CardSuit.NAN || s === CardSuit.XI ||
                s === CardSuit.BEI || s === CardSuit.ZHONG || s === CardSuit.FA || s === CardSuit.BAI;
        }
        const allZi = suitList.every(isZiPai);
        const allXuShu = suitList.every(s => !isZiPai(s));

        // 情况A：全部是万筒条序数牌 → 必须同花色 + rank连续
        if(allXuShu){
            if (a.suit !== b.suit || b.suit !== c.suit) return false;
            const arr = [a.rank, b.rank, c.rank].sort((x, y) => x - y);
            return arr[0] + 1 === arr[1] && arr[1] + 1 === arr[2];
        }
        // 情况B：全部是字牌 → 只需要rank连续，花色可以不一样
        if(allZi){
            const arr = [a.rank, b.rank, c.rank].sort((x, y) => x - y);
            return arr[0] + 1 === arr[1] && arr[1] + 1 === arr[2];
        }
        // 混合字牌+序数牌不能吃
        return false;
    }
}
