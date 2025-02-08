import { Injectable } from '@nestjs/common';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from '../../player/entities/player.entity';
import { PlayerService } from '../../player/services/player.service';
import { EventsService } from '../../events/services/events.service';

interface RankingUpdateEvent {
  id: string;
  rank: number;
}

@Injectable()
export class RankingService {

  constructor(
    private playerService: PlayerService,
    private eventService: EventsService
  ) { }

  getRanking(callback: (error: any, ranking?: Player[]) => void): void {
    this.playerService.findAll((error, players) => {
      if (error) {
        callback(error);
        return;
      }
      callback(null, players);
    });
  }

  getRankingUpdates(): Observable<MessageEvent> {
    return fromEvent(this.eventService.getRankingEmitter(), 'rankingUpdate').pipe(
      map((player: RankingUpdateEvent) => {
        const messageData = {
          type: 'RankingUpdate',
          player
        };
        return new MessageEvent('message', {
          data: messageData,
          lastEventId: '',
          origin: '',
        });
      })
    );
  }
}