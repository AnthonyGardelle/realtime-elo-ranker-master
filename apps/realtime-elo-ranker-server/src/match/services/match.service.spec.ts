import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../entities/match.entity';
import { Player } from '../../player/entities/player.entity';
import { PlayerService } from '../../player/services/player.service';
import { RankingService } from '../../ranking/services/ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventsService } from '../../events/services/events.service';
import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';

describe('MatchService', () => {
  let service: MatchService;
  let playerService: PlayerService;
  let matchRepository: Repository<Match>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        PlayerService,
        RankingService,
        EventsService,
        EventEmitter2,
        {
          provide: getRepositoryToken(Match),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn(),
            save: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(Player),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn(),
            save: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
    playerService = module.get<PlayerService>(PlayerService);
    matchRepository = module.get(getRepositoryToken(Match));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateElo', () => {
    it('should calculate new ratings for a win', () => {
      const result = service.calculateElo(1000, 1000, false);
      expect(result.newWinnerRank).toBeGreaterThan(1000);
      expect(result.newLoserRank).toBeLessThan(1000);
    });

    it('should calculate new ratings for a draw', () => {
      const result = service.calculateElo(1000, 1000, true);
      expect(result.newWinnerRank).toBe(1000);
      expect(result.newLoserRank).toBe(1000);
    });
  });

  describe('create', () => {
    const createMatchDto = {
      winner: 'player1',
      loser: 'player2',
      draw: false
    };

    it('should create a match successfully', async () => {
      const winner = { id: 'player1', rank: 1000 };
      const loser = { id: 'player2', rank: 1000 };
      const savedMatch = {
        id: '1',
        winnerId: winner.id,
        winnerRank: winner.rank,
        loserId: loser.id,
        loserRank: loser.rank,
        draw: createMatchDto.draw
      };
  
      jest.spyOn(playerService, 'findOne').mockImplementation((id, cb) => {
        cb(null, id === 'player1' ? winner : loser);
      });
      jest.spyOn(playerService, 'update').mockImplementation((player, cb) => cb(null));
      jest.spyOn(matchRepository, 'save').mockResolvedValue(savedMatch);
  
      await new Promise<void>((resolve) => {
        service.create(createMatchDto, (error, result) => {
          expect(error).toBeNull();
          expect(result).toEqual(savedMatch);
          resolve();
        });
      });
    });

    it('should handle winner player not found', async () => {
      const error = new UnprocessableEntityException('Player not found');
      jest.spyOn(playerService, 'findOne').mockImplementation((id, cb) => cb(error));

      await new Promise<void>((resolve) => {
        service.create(createMatchDto, (error, result) => {
          expect(error).toBeDefined();
          expect(error.message).toContain('gagnant');
          resolve();
        });
      });
    });

    it('should handle loser player not found', async () => {
      const winner = { id: 'player1', rank: 1000 };
      const error = new UnprocessableEntityException('Player not found');
      
      jest.spyOn(playerService, 'findOne').mockImplementation((id, cb) => {
        if (id === 'player1') {
          cb(null, winner);
        } else {
          cb(error);
        }
      });

      await new Promise<void>((resolve) => {
        service.create(createMatchDto, (error, result) => {
          expect(error).toBeDefined();
          expect(error.message).toContain('perdant');
          resolve();
        });
      });
    });

    it('should handle same player error', async () => {
      const player = { id: 'player1', rank: 1000 };
      const samePlayerDto = {
        winner: 'player1',
        loser: 'player1',
        draw: false
      };

      jest.spyOn(playerService, 'findOne').mockImplementation((id, cb) => cb(null, player));

      await new Promise<void>((resolve) => {
        service.create(samePlayerDto, (error, result) => {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toContain('même joueur');
          resolve();
        });
      });
    });

    it('should handle repository save error', async () => {
      const winner = { id: 'player1', rank: 1000 };
      const loser = { id: 'player2', rank: 1000 };
      const saveError = new Error('Database error');
      
      jest.spyOn(playerService, 'findOne').mockImplementation((id, cb) => {
        cb(null, id === 'player1' ? winner : loser);
      });
      jest.spyOn(matchRepository, 'save').mockRejectedValue(saveError);
  
      await new Promise<void>((resolve) => {
        service.create(createMatchDto, (error, result) => {
          expect(error).toBe(saveError);
          resolve();
        });
      });
    });

    it('should handle winner update error', async () => {
      const winner = { id: 'player1', rank: 1000 };
      const loser = { id: 'player2', rank: 1000 };
      const updateError = new Error('Update error');
      
      jest.spyOn(playerService, 'findOne').mockImplementation((id, cb) => {
        cb(null, id === 'player1' ? winner : loser);
      });
      jest.spyOn(matchRepository, 'save').mockResolvedValue(new Match());
      jest.spyOn(playerService, 'update').mockImplementation((player, cb) => {
        if (player.id === winner.id) {
          cb(updateError);
        } else {
          cb(null);
        }
      });
  
      await new Promise<void>((resolve) => {
        service.create(createMatchDto, (error, result) => {
          expect(error).toBe(updateError);
          resolve();
        });
      });
    });

    it('should handle loser update error', async () => {
      const winner = { id: 'player1', rank: 1000 };
      const loser = { id: 'player2', rank: 1000 };
      const updateError = new Error('Update error');
      
      jest.spyOn(playerService, 'findOne').mockImplementation((id, cb) => {
        cb(null, id === 'player1' ? winner : loser);
      });
      jest.spyOn(matchRepository, 'save').mockResolvedValue(new Match());
      jest.spyOn(playerService, 'update').mockImplementation((player, cb) => {
        if (player.id === loser.id) {
          cb(updateError);
        } else {
          cb(null);
        }
      });
  
      await new Promise<void>((resolve) => {
        service.create(createMatchDto, (error, result) => {
          expect(error).toBe(updateError);
          resolve();
        });
      });
    });
  });

  describe('findOne', () => {
    it('should find a match by id', async () => {
      const match = { 
        id: '1', 
        winnerId: 'player1',
        winnerRank: 1200,
        loserId: 'player2',
        loserRank: 1000,
        draw: false
      };
      jest.spyOn(matchRepository, 'findOne').mockResolvedValue(match);
  
      await new Promise<void>((resolve) => {
        service.findOne('1', (error, result) => {
          expect(error).toBeNull();
          expect(result).toEqual(match);
          resolve();
        });
      });
    });
  
    it('should handle invalid id', async () => {
      await new Promise<void>((resolve) => {
        service.findOne('', (error) => {
          expect(error).toBeInstanceOf(BadRequestException);
          resolve();
        });
      });
    });

    it('should handle match not found', async () => {
      jest.spyOn(matchRepository, 'findOne').mockResolvedValue(null);

      await new Promise<void>((resolve) => {
        service.findOne('1', (error, result) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          expect(error.message).toContain('n\'existe pas');
          resolve();
        });
      });
    });

    it('should handle repository error', async () => {
      const repoError = new Error('Database error');
      jest.spyOn(matchRepository, 'findOne').mockRejectedValue(repoError);
  
      await new Promise<void>((resolve) => {
        service.findOne('1', (error, result) => {
          expect(error).toBe(repoError);
          resolve();
        });
      });
    });
  });

  describe('handlePlayerError', () => {
    it('should handle BadRequestException', async () => {
      const error = new BadRequestException('Invalid ID');
      const callback = jest.fn();
      const role = 'test';
  
      service['handlePlayerError'](error, callback, role);
  
      expect(callback).toHaveBeenCalledWith(
        expect.any(BadRequestException)
      );
      expect(callback.mock.calls[0][0].message).toContain(role);
    });
  
    it('should handle unknown errors', async () => {
      const error = new Error('Unknown error');
      const callback = jest.fn();
      const role = 'test';
  
      service['handlePlayerError'](error, callback, role);
  
      expect(callback).toHaveBeenCalledWith(error);
    });
  });
});