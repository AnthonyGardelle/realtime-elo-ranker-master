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
    const createPlayerDto = { id: 'player1' };
  
    it('should handle invalid player ID', async () => {
      await new Promise<void>((resolve) => {
        service.create({ id: '' }, (error) => {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toBe('L\'identifiant du joueur n\'est pas valide');
          resolve();
        });
      });
    });
  
    it('should create player with average rank when players exist', async () => {
      const existingPlayers = [
        { id: 'player2', rank: 1000 },
        { id: 'player3', rank: 1200 }
      ];
      const expectedRank = 1100; // (1000 + 1200) / 2

      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(playerRepository, 'find').mockResolvedValue(existingPlayers);
      jest.spyOn(playerRepository, 'save').mockImplementation(entity => Promise.resolve({
        ...entity,
        id: entity.id || '',
        rank: entity.rank || 0
      } as Player));
      jest.spyOn(eventsService, 'emitRankingUpdate');

      await new Promise<void>((resolve) => {
        service.create(createPlayerDto, (error, result) => {
          expect(error).toBeNull();
          expect(result).toBeDefined();
          expect(result.rank).toBe(expectedRank);
          expect(eventsService.emitRankingUpdate).toHaveBeenCalledWith({
            id: createPlayerDto.id,
            rank: expectedRank
          });
          resolve();
        });
      });
    });
  
    it('should create player with default rank when no players exist', async () => {
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(playerRepository, 'find').mockResolvedValue([]);
      jest.spyOn(playerRepository, 'save').mockImplementation(entity => Promise.resolve({
        ...entity,
        id: entity.id || '',
        rank: entity.rank || 0
      } as Player));
      jest.spyOn(eventsService, 'emitRankingUpdate');
  
      await new Promise<void>((resolve) => {
        service.create(createPlayerDto, (error, result) => {
          expect(error).toBeNull();
          expect(result).toBeDefined();
          expect(result.rank).toBe(1000); // Default rank
          expect(eventsService.emitRankingUpdate).toHaveBeenCalledWith({
            id: createPlayerDto.id,
            rank: 1000
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