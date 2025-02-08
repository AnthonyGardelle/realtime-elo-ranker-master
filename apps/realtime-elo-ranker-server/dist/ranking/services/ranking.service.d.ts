import { Observable } from 'rxjs';
import { Player } from '../../player/entities/player.entity';
import { PlayerService } from '../../player/services/player.service';
import { EventsService } from '../../events/services/events.service';
export declare class RankingService {
    private playerService;
    private eventService;
    private rankings;
    constructor(playerService: PlayerService, eventService: EventsService);
    private initializeRankings;
    getRanking(callback: (error: any, ranking?: Player[]) => void): void;
    updateRanking(player: Player): void;
    getRankingUpdates(): Observable<MessageEvent>;
}
