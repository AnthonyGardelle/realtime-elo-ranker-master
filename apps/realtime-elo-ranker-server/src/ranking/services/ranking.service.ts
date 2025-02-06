import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from '../../player/entities/player.entity';

interface RankingUpdateEvent {
  id: string;
  rank: number;
}

@Injectable()
export class RankingService {
  private readonly rankingEmitter = new EventEmitter2();

  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) { }

  getRanking(callback: (error: any, ranking?: Player[]) => void): void {
    this.playerRepository.find()
      .then(players => {
        callback(null, players);
      })
      .catch(error => {
        callback(error);
      });
  }

  getRankingUpdates(): Observable<MessageEvent> {
    return fromEvent<RankingUpdateEvent>(this.rankingEmitter, 'rankingUpdate').pipe(
      map(player => {
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

  emitRankingUpdate(player: { id: string; rank: number }): void {
    this.rankingEmitter.emit('rankingUpdate', player);
  }
}