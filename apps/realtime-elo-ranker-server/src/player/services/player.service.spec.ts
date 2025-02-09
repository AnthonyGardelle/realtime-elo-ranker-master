import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventsService } from '../../events/services/events.service';
import { BadRequestException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('PlayerService', () => {
  let service: PlayerService;
  let playerRepository: Repository<Player>;
  let eventsService: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        EventsService,
        EventEmitter2,
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

    service = module.get<PlayerService>(PlayerService);
    playerRepository = module.get(getRepositoryToken(Player));
    eventsService = module.get<EventsService>(EventsService);
  });

  describe('findAll', () => {
    it('should return all players', async () => {
      const players = [{ id: '1', rank: 1000 }];
      jest.spyOn(playerRepository, 'find').mockResolvedValue(players);

      await new Promise<void>((resolve) => {
        service.findAll((error, result) => {
          expect(error).toBeNull();
          expect(result).toEqual(players);
          resolve();
        });
      });
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      jest.spyOn(playerRepository, 'find').mockRejectedValue(error);

      await new Promise<void>((resolve) => {
        service.findAll((error, result) => {
          expect(error).toBeDefined();
          expect(result).toBeUndefined();
          resolve();
        });
      });
    });
  });

  describe('create', () => {
    it('should create a new player', async () => {
      const createPlayerDto = { id: 'player1' };
      const savedPlayer = { id: 'player1', rank: 1000 };
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(playerRepository, 'find').mockResolvedValue([]);
      jest.spyOn(playerRepository, 'save').mockResolvedValue(savedPlayer);
      jest.spyOn(eventsService, 'emitRankingUpdate');

      await new Promise<void>((resolve) => {
        service.create(createPlayerDto, (error, result) => {
          expect(error).toBeNull();
          expect(result).toEqual(savedPlayer);
          expect(eventsService.emitRankingUpdate).toHaveBeenCalledWith({
            id: savedPlayer.id,
            rank: savedPlayer.rank
          });
          resolve();
        });
      });
    });

    it('should handle invalid id', async () => {
      const createPlayerDto = { id: '' };

      await new Promise<void>((resolve) => {
        service.create(createPlayerDto, (error) => {
          expect(error).toBeInstanceOf(BadRequestException);
          resolve();
        });
      });
    });

    it('should handle existing player', async () => {
      const createPlayerDto = { id: 'player1' };
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue({ id: 'player1', rank: 1000 });

      await new Promise<void>((resolve) => {
        service.create(createPlayerDto, (error) => {
          expect(error).toBeInstanceOf(ConflictException);
          resolve();
        });
      });
    });

    it('should handle repository save error', async () => {
      const createPlayerDto = { id: 'player1' };
      const saveError = new Error('Database error');
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(playerRepository, 'find').mockResolvedValue([]);
      jest.spyOn(playerRepository, 'save').mockRejectedValue(saveError);
  
      await new Promise<void>((resolve) => {
        service.create(createPlayerDto, (error) => {
          expect(error).toBe(saveError);
          resolve();
        });
      });
    });
  
    it('should handle repository findOne error in findOne method', async () => {
      const findError = new Error('Database error');
      jest.spyOn(playerRepository, 'findOne').mockRejectedValue(findError);
  
      await new Promise<void>((resolve) => {
        service.findOne('player1', (error) => {
          expect(error).toBe(findError);
          resolve();
        });
      });
    });

    it('should calculate average rank from existing players', async () => {
      const createPlayerDto = { id: 'player1' };
      const existingPlayers = [
        { id: 'player2', rank: 1000 },
        { id: 'player3', rank: 1200 }
      ];
      const expectedRank = 1100; // (1000 + 1200) / 2
      const savedPlayer = {
        id: 'player1',
        rank: expectedRank
      };
      
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(playerRepository, 'find').mockResolvedValue(existingPlayers);
      jest.spyOn(playerRepository, 'save').mockResolvedValue(savedPlayer);
      jest.spyOn(eventsService, 'emitRankingUpdate');
  
      await new Promise<void>((resolve) => {
        service.create(createPlayerDto, (error, result) => {
          expect(error).toBeNull();
          expect(result.rank).toBe(expectedRank);
          expect(eventsService.emitRankingUpdate).toHaveBeenCalledWith({
            id: savedPlayer.id,
            rank: expectedRank
          });
          resolve();
        });
      });
    });
  
    it('should use default rank 1000 when no players exist', async () => {
      const createPlayerDto = { id: 'player1' };
      const expectedRank = 1000;
      const savedPlayer = {
        id: 'player1',
        rank: expectedRank
      };
  
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(playerRepository, 'find').mockResolvedValue([]);
      jest.spyOn(playerRepository, 'save').mockResolvedValue(savedPlayer);
      jest.spyOn(eventsService, 'emitRankingUpdate');
  
      await new Promise<void>((resolve) => {
        service.create(createPlayerDto, (error, result) => {
          expect(error).toBeNull();
          expect(result.rank).toBe(expectedRank);
          expect(eventsService.emitRankingUpdate).toHaveBeenCalledWith({
            id: savedPlayer.id,
            rank: expectedRank
          });
          resolve();
        });
      });
    });
  });

  describe('findOne', () => {
    it('should find a player', async () => {
      const player = { id: 'player1', rank: 1000 };
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(player);

      await new Promise<void>((resolve) => {
        service.findOne('player1', (error, result) => {
          expect(error).toBeNull();
          expect(result).toEqual(player);
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

    it('should handle non-existent player', async () => {
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(null);

      await new Promise<void>((resolve) => {
        service.findOne('player1', (error) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          resolve();
        });
      });
    });
  });

  describe('update', () => {
    it('should update a player', async () => {
      const updatePlayerDto = { id: 'player1', rank: 1200 };
      const existingPlayer = { id: 'player1', rank: 1000 };
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(existingPlayer);
      jest.spyOn(playerRepository, 'save').mockResolvedValue({ ...existingPlayer, rank: updatePlayerDto.rank });
      jest.spyOn(eventsService, 'emitRankingUpdate');

      await new Promise<void>((resolve) => {
        service.update(updatePlayerDto, (error) => {
          expect(error).toBeNull();
          expect(eventsService.emitRankingUpdate).toHaveBeenCalledWith({
            id: updatePlayerDto.id,
            rank: updatePlayerDto.rank
          });
          resolve();
        });
      });
    });

    it('should handle invalid id', async () => {
      const updatePlayerDto = { id: '', rank: 1200 };

      await new Promise<void>((resolve) => {
        service.update(updatePlayerDto, (error) => {
          expect(error).toBeInstanceOf(BadRequestException);
          resolve();
        });
      });
    });

    it('should handle non-existent player', async () => {
      const updatePlayerDto = { id: 'player1', rank: 1200 };
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(null);

      await new Promise<void>((resolve) => {
        service.update(updatePlayerDto, (error) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          resolve();
        });
      });
    });

    it('should handle repository save error', async () => {
      const updatePlayerDto = { id: 'player1', rank: 1200 };
      const existingPlayer = { id: 'player1', rank: 1000 };
      const saveError = new Error('Database error');
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(existingPlayer);
      jest.spyOn(playerRepository, 'save').mockRejectedValue(saveError);
  
      await new Promise<void>((resolve) => {
        service.update(updatePlayerDto, (error) => {
          expect(error).toBe(saveError);
          resolve();
        });
      });
    });

    it('should handle repository findOne error', async () => {
    const updatePlayerDto = { id: 'player1', rank: 1200 };
    const findError = new Error('Database error');
    jest.spyOn(playerRepository, 'findOne').mockRejectedValue(findError);

    await new Promise<void>((resolve) => {
      service.update(updatePlayerDto, (error) => {
        expect(error).toBe(findError);
        resolve();
      });
    });
  });
  });
});