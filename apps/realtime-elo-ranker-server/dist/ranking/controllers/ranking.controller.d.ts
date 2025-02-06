import { Observable } from 'rxjs';
import { RankingService } from '../services/ranking.service';
export declare class RankingController {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    getRanking(): Promise<unknown>;
    subscribeToRankingUpdates(): Observable<MessageEvent>;
}
