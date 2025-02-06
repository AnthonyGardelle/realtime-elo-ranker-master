import { Repository } from 'typeorm';
import { Observable } from 'rxjs';
import { Player } from '../../player/entities/player.entity';
export declare class RankingService {
    private playerRepository;
    private readonly rankingEmitter;
    constructor(playerRepository: Repository<Player>);
    getRanking(callback: (error: any, ranking?: Player[]) => void): void;
    getRankingUpdates(): Observable<MessageEvent>;
    emitRankingUpdate(player: {
        id: string;
        rank: number;
    }): void;
}
