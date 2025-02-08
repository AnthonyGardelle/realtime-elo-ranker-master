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
  private rankings: Player[] = [];

  constructor(
    private playerService: PlayerService,
    private eventService: EventsService
  ) {
    this.initializeRankings();
  }

  private initializeRankings(): void {
    this.playerService.findAll((error, players) => {
      if (!error && players) {
        this.rankings = players.sort((a, b) => b.rank - a.rank);
      }
    });
  }

  getRanking(callback: (error: any, ranking?: Player[]) => void): void {
    callback(null, this.rankings);
  }

  updateRanking(player: Player): void {
    const index = this.rankings.findIndex(p => p.id === player.id);
    if (index !== -1) {
      this.rankings[index].rank = player.rank;
    } else {
      this.rankings.push(player);
    }
    this.rankings.sort((a, b) => b.rank - a.rank);
  }

  getRankingUpdates(): Observable<MessageEvent> {
    return fromEvent(this.eventService.getRankingEmitter(), 'rankingUpdate').pipe(
      map((player: RankingUpdateEvent) => {
        this.updateRanking({ id: player.id, rank: player.rank } as Player);
        
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