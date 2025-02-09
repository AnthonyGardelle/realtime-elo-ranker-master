import { Injectable, BadRequestException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../entities/player.entity';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';
import { EventsService } from '../../events/services/events.service';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private eventsService: EventsService,
  ) { }

  findAll(callback: (error: any, result?: Player[]) => void) {
    this.playerRepository.find()
      .then(players => {
        callback(null, players);
      })
      .catch(error => callback(error));
  }

  create(createPlayerDto: CreatePlayerDto, callback: (error: any, result?: any) => void) {
    if (!createPlayerDto.id) {
      return callback(new BadRequestException('L\'identifiant du joueur n\'est pas valide'));
    }

    this.playerRepository.findOne({ where: { id: createPlayerDto.id } })
      .then(existingPlayer => {
        if (existingPlayer) {
          return callback(new ConflictException('Le joueur existe déjà'));
        }

        this.playerRepository.find()
          .then(players => {
            const totalRank = players.reduce((sum, player) => sum + player.rank, 0);
            const averageRank = players.length ? Math.round(totalRank / players.length) : 1000;

            const player = new Player();
            player.id = createPlayerDto.id;
            player.rank = averageRank;

            this.playerRepository.save(player)
              .then(savedPlayer => {
                this.eventsService.emitRankingUpdate({
                  id: savedPlayer.id,
                  rank: savedPlayer.rank
                });
                callback(null, savedPlayer);
              })
              .catch(error => callback(error));
          });
      });
  }

  findOne(id: string, callback: (error: any, result?: any) => void) {
    if (!id) {
      return callback(new BadRequestException('L\'identifiant du joueur n\'est pas valide'));
    }

    this.playerRepository.findOne({ where: { id } })
      .then(player => {
        if (!player) {
          return callback(new UnprocessableEntityException('Le joueur n\'existe pas'));
        }
        callback(null, player);
      })
      .catch(error => callback(error));
  }

  update(updatePlayerDto: UpdatePlayerDto, callback: (error: any) => void) {
    if (!updatePlayerDto.id) {
      return callback(new BadRequestException('L\'identifiant du joueur n\'est pas valide'));
    }
  
    this.playerRepository.findOne({ where: { id: updatePlayerDto.id } })
      .then(existingPlayer => {
        if (!existingPlayer) {
          return callback(new UnprocessableEntityException('Le joueur n\'existe pas'));
        }
  
        // Remove the redundant findOne call and use existingPlayer instead
        existingPlayer.rank = updatePlayerDto.rank; // Update rank from DTO
        
        this.playerRepository.save(existingPlayer)
          .then(() => {
            this.eventsService.emitRankingUpdate({
              id: existingPlayer.id,
              rank: existingPlayer.rank
            });
            callback(null);
          })
          .catch(error => callback(error));
      })
      .catch(error => callback(error));
  }
}