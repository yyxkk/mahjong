// CardType.ts
/**
 * 花色：万、条、筒
 */
export enum CardSuit {
    WAN = 0,    // 万
    TIAO = 1,   // 条（索）
    TONG = 2,   // 筒（饼）
}

/**
 * 麻将牌数据结构
 */
export class CardData {
    suit: CardSuit;    // 花色
    rank: number;   // 点数 1~9

    constructor(suit: CardSuit, rank: number) {
        this.suit = suit;
        this.rank = rank;
    }

    /** 判断两张牌是否完全一样（用于碰判断） */
    equal(other: MahjongCard): boolean {
        return this.suit === other.suit && this.rank === other.rank;
    }

    /** 判断三张是否连续（用于吃判断，同花色） */
    static isSequence(a: MahjongCard, b: MahjongCard, c: MahjongCard): boolean {
        if (a.suit !== b.suit || b.suit !== c.suit) return false;
        const arr = [a.rank, b.rank, c.rank].sort((x,y)=>x-y);
        return arr[0] +1 === arr[1] && arr[1]+1 === arr[2];
    }
}
