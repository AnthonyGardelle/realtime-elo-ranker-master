import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from '../services/match.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from '../entities/match.entity';
import { Player } from '../../player/entities/player.entity';
import { PlayerService } from '../../player/services/player.service';
import { RankingService } from '../../ranking/services/ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventsService } from '../../events/services/events.service';
import { UnprocessableEntityException, BadRequestException } from '@nestjs/common';

describe('MatchController', () => {
  let controller: MatchController;
  let matchService: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
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

    controller = module.get<MatchController>(MatchController);
    matchService = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createMatchDto = {
      winner: 'player1',
      loser: 'player2',
      draw: false
    };

    it('should create a match successfully', async () => {
      const match = {
        winnerId: 'player1',
        winnerRank: 1200,
        loserId: 'player2',
        loserRank: 1000
      };
      jest.spyOn(matchService, 'create').mockImplementation((dto, callback) => callback(null, match));

      const result = await controller.create(createMatchDto);
      expect(result).toEqual({
        winner: { id: match.winnerId, rank: match.winnerRank },
        loser: { id: match.loserId, rank: match.loserRank }
      });
    });

    it('should handle UnprocessableEntityException', async () => {
      const error = new UnprocessableEntityException('Player not found');
      jest.spyOn(matchService, 'create').mockImplementation((dto, callback) => callback(error));

      const result = await controller.create(createMatchDto);
      expect(result).toEqual({
        code: 422,
        message: error.message
      });
    });

    it('should handle BadRequestException', async () => {
      const error = new BadRequestException('Invalid match');
      jest.spyOn(matchService, 'create').mockImplementation((dto, callback) => callback(error));

      const result = await controller.create(createMatchDto);
      expect(result).toEqual({
        code: 400,
        message: error.message
      });
    });

    it('should reject unknown errors', async () => {
      const unknownError = new Error('Unknown error');
      jest.spyOn(matchService, 'create').mockImplementation((dto, callback) => callback(unknownError));
  
      await expect(controller.create(createMatchDto)).rejects.toEqual(unknownError);
    });
  });
});