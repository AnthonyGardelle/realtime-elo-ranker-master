import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { UpdateMatchDto } from './dto/update-match.dto';
import { PlayerService } from 'src/player/player.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { Player } from 'src/player/entities/player.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private playerService: PlayerService,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) { }

  handlePlayerError(error: any, callback: (error: any, result?: any) => void, role: string) {
    if (error instanceof BadRequestException) {
      return callback(new BadRequestException(`L'identifiant du joueur ${role} n'est pas valide`));
    } else if (error instanceof UnprocessableEntityException) {
      return callback(new UnprocessableEntityException(`Le joueur ${role} n'existe pas`));
    } else {
      return callback(error);
    }
  }

  calculateElo(winnerRank: number, loserRank: number, draw: boolean) {
    const K = 32;
    const winnerExpectedScore = 1 / (1 + Math.pow(10, (loserRank - winnerRank) / 400));
    const loserExpectedScore = 1 / (1 + Math.pow(10, (winnerRank - loserRank) / 400));

    let newWinnerRank, newLoserRank;
    if (draw) {
      newWinnerRank = Math.round(winnerRank + K * (0.5 - winnerExpectedScore));
      newLoserRank = Math.round(loserRank + K * (0.5 - loserExpectedScore));
    } else {
      newWinnerRank = Math.round(winnerRank + K * (1 - winnerExpectedScore));
      newLoserRank = Math.round(loserRank + K * (0 - loserExpectedScore));
    }

    return { newWinnerRank, newLoserRank };
  }

  findAll(callback: (error: any, result?: any) => void) {
    this.matchRepository.find()
      .then(matchs => {
        callback(null, matchs);
      })
      .catch(error => {
        callback(error);
      });
  }

  create(createMatchDto: CreateMatchDto, callback: (error: any, result?: any) => void) {
    this.playerService.findOne(createMatchDto.winner, (error, winner) => {
      if (error) {
        return this.handlePlayerError(error, callback, 'gagnant');
      }
      this.playerService.findOne(createMatchDto.loser, (error, loser) => {
        if (error) {
          return this.handlePlayerError(error, callback, 'perdant');
        }

        const { newWinnerRank, newLoserRank } = this.calculateElo(winner.rank, loser.rank, createMatchDto.draw);

        winner.rank = newWinnerRank;
        loser.rank = newLoserRank;

        const match = new Match();
        match.winnerId = winner.id;
        match.winnerRank = winner.rank;
        match.loserId = loser.id;
        match.loserRank = loser.rank;
        match.draw = createMatchDto.draw;

        this.matchRepository.save(match).then(savedMatch => {
          this.playerRepository.save(winner).then(() => {
            this.playerRepository.save(loser).then(() => {
              callback(null, savedMatch);
            }).catch(error => {
              callback(error);
            });
          }).catch(error => {
            callback(error);
          });
        }).catch(error => {
          callback(error);
        });
      });
    });
  }

  findOne(id: string, callback: (error: any, result?: any) => void) {
    if (!id) {
      return callback(new BadRequestException('L\'identifiant du match n\'est pas valide'));
    }
    this.matchRepository.findOne({ where: { id: id } })
      .then(match => {
        if (!match) {
          return callback(new UnprocessableEntityException('Le match n\'existe pas'));
        }
        callback(null, match);
      })
      .catch(error => {
        callback(error);
      });
  }

  update(id: string, updateMatchDto: UpdateMatchDto, callback: (error: any, result?: any) => void) {
    // TODO
  }

  delete(id: number) {
    // TODO
  }
}
