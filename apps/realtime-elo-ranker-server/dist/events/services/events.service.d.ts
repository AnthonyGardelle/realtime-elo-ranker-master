import { EventEmitter2 } from "@nestjs/event-emitter";
export declare class EventsService {
    private readonly rankingEmitter;
    constructor();
    emitRankingUpdate(player: {
        id: string;
        rank: number;
    }): void;
    emitPlayerCreated(player: {
        id: string;
        rank: number;
    }): void;
    getRankingEmitter(): EventEmitter2;
}
