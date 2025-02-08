import { Observable } from 'rxjs';
import { Player } from '../../player/entities/player.entity';
import { PlayerService } from '../../player/services/player.service';
import { EventsService } from '../../events/services/events.service';
export declare class RankingService {
    private playerService;
    private eventService;
    constructor(playerService: PlayerService, eventService: EventsService);
    getRanking(callback: (error: any, ranking?: Player[]) => void): void;
    getRankingUpdates(): Observable<MessageEvent>;
}
