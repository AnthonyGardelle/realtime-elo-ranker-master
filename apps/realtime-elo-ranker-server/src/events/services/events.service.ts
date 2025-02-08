import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class EventsService {
    private readonly rankingEmitter = new EventEmitter2();

    constructor(
    ) { }

    emitRankingUpdate(player: { id: string; rank: number }): void {
        this.rankingEmitter.emit('rankingUpdate', player);
    }

    getRankingEmitter(): EventEmitter2 {
        return this.rankingEmitter;
    }
}