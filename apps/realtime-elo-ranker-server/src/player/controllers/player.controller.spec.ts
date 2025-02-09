import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from '../services/player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { RankingService } from '../../ranking/services/ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventsService } from '../../events/services/events.service';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('PlayerController', () => {
  let controller: PlayerController;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        PlayerService,
        RankingService,
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

    controller = module.get<PlayerController>(PlayerController);
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createPlayerDto = { id: 'player1' };

    it('should create a player successfully', async () => {
      const result = { id: 'player1', rank: 1000 };
      jest.spyOn(playerService, 'create').mockImplementation((dto, callback) => callback(null, result));

      const response = await controller.create(createPlayerDto);
      expect(response).toEqual(result);
    });

    it('should handle BadRequestException', async () => {
      const error = new BadRequestException('Invalid player ID');
      jest.spyOn(playerService, 'create').mockImplementation((dto, callback) => callback(error));

      const response = await controller.create(createPlayerDto);
      expect(response).toEqual({
        code: 400,
        message: error.message
      });
    });

    it('should handle ConflictException', async () => {
      const error = new ConflictException('Player already exists');
      jest.spyOn(playerService, 'create').mockImplementation((dto, callback) => callback(error));

      const response = await controller.create(createPlayerDto);
      expect(response).toEqual({
        code: 409,
        message: error.message
      });
    });

    it('should reject unknown errors', async () => {
      const error = new Error('Unknown error');
      jest.spyOn(playerService, 'create').mockImplementation((dto, callback) => callback(error));

      await expect(controller.create(createPlayerDto)).rejects.toEqual(error);
    });
  });
});