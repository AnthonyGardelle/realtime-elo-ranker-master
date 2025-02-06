import { Controller, Get, NotFoundException, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RankingService } from '../services/ranking.service';

@Controller('api/ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) { }

  @Get()
  getRanking() {
    return new Promise((resolve, reject) => {
      this.rankingService.getRanking((error, ranking) => {
        if (error) {
          return reject(error);
        }
        if (!ranking || ranking.length === 0) {
          return reject(new NotFoundException({
            code: 404,
            message: "Le classement n'est pas disponible car aucun joueur n'existe.",
          }));
        }
        resolve(ranking);
      });
    });
  }

  @Sse('events')
  subscribeToRankingUpdates(): Observable<MessageEvent> {
    console.log("Test");
    return this.rankingService.getRankingUpdates();
  }
}