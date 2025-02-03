import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../player/entities/player.entity';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) { }

  /**
   * Récupère le classement de tous les joueurs, trié par rang (descendant).
   * @param callback La fonction de callback à appeler avec les résultats ou une erreur.
   */
  getRanking(callback: (error: any, ranking?: { id: string; rank: number }[]) => void) {
    this.playerRepository.find({ order: { rank: 'DESC' } })
      .then(players => {
        const ranking = players.map(player => ({
          id: player.id,
          rank: player.rank,
        }));

        callback(null, ranking);
      })
      .catch(error => {
        callback(error);
      });
  }
}
