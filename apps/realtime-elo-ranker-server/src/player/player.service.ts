import { Injectable, BadRequestException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) { }

  findAll(callback: (error: any, result?: any) => void) {
    this.playerRepository.find()
      .then(players => {
        callback(null, players);
      })
      .catch(error => {
        callback(error);
      });
  }

  create(createPlayerDto: CreatePlayerDto, callback: (error: any, result?: any) => void) {
    if (!createPlayerDto.id) {
      return callback(new BadRequestException('L\'identifiant du joueur n\'est pas valide'));
    }

    this.playerRepository.findOne({ where: { id: createPlayerDto.id } }).then(existingPlayer => {
      if (existingPlayer) {
        return callback(new ConflictException('Le joueur existe déjà'));
      }

      this.playerRepository.find().then(players => {
        const totalRank = players.reduce((sum, player) => sum + player.rank, 0);
        const averageRank = players.length ? Math.round(totalRank / players.length) : 0;

        const player = new Player();
        player.id = createPlayerDto.id;
        player.rank = createPlayerDto.rank ?? averageRank;

        this.playerRepository.save(player).then(savedPlayer => {
          callback(null, savedPlayer);
        }).catch(error => {
          callback(error);
        });
      }).catch(error => {
        callback(error);
      });
    }).catch(error => {
      callback(error);
    });
  }

  findOne(id: string, callback: (error: any, result?: any) => void) {
    if (!id) {
      return callback(new BadRequestException('L\'identifiant du joueur n\'est pas valide'));
    }
    this.playerRepository.findOne({ where: { id: id } })
      .then(player => {
        if (!player) {
          return callback(new UnprocessableEntityException('Le joueur n\'existe pas'));
        }
        callback(null, player);
      })
      .catch(error => {
        callback(error);
      });
  }

  update(id: string, updatePlayerDto: UpdatePlayerDto, callback: (error: any, result?: any) => void) {
    this.playerRepository.findOne({ where: { id: id } })
      .then(player => {
        if (!player) {
          return callback(new UnprocessableEntityException('Le joueur n\'existe pas'));
        }
        if (updatePlayerDto.id && updatePlayerDto.id !== id) {
          return callback(new BadRequestException('Modification de l\'ID non autorisée'));
        }
        Object.assign(player, updatePlayerDto);
        this.playerRepository.save(player).then(updatedPlayer => {
          callback(null, updatedPlayer);
        }).catch(error => {
          callback(error);
        });
      })
      .catch(error => {
        callback(error);
      });
  }

  delete(id: string, callback: (error: any, result?: any) => void) {
    this.playerRepository.findOne({ where: { id: id } })
      .then(player => {
        if (!player) {
          return callback(new UnprocessableEntityException('Le joueur n\'existe pas'));
        }
        this.playerRepository.delete({ id: id })
          .then(result => {
            if (result.affected === 0) {
              return callback(new BadRequestException('Erreur lors de la suppression du joueur'));
            }
            callback(null, result);
          })
          .catch(error => {
            callback(error);
          });
      })
      .catch(error => {
        callback(error);
      });
  }
}