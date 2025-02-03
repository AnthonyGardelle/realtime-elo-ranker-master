import { RankingService } from './ranking.service';
export declare class RankingController {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    getRanking(): Promise<unknown>;
}
