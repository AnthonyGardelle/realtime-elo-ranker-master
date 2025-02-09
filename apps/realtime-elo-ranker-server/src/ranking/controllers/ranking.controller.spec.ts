import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from '../controllers/ranking.controller';
import { RankingService } from '../services/ranking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../../player/entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from '../../player/services/player.service';
import { EventsService } from '../../events/services/events.service';
import { NotFoundException } from '@nestjs/common';
import { Observable, of } from 'rxjs';

describe('RankingController', () => {
  let controller: RankingController;
  let rankingService: RankingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        RankingService,
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

    controller = module.get<RankingController>(RankingController);
    rankingService = module.get<RankingService>(RankingService);
  });

  describe('getRanking', () => {
    it('should get ranking successfully', async () => {
      const ranking = [{ id: 'player1', rank: 1000 }];
      jest.spyOn(rankingService, 'getRanking').mockImplementation(cb => cb(null, ranking));

      const result = await controller.getRanking();
      expect(result).toEqual(ranking);
    });

    it('should handle empty ranking', async () => {
      const error = new NotFoundException({
        code: 404,
        message: "Le classement n'est pas disponible car aucun joueur n'existe"
      });
      jest.spyOn(rankingService, 'getRanking').mockImplementation(cb => cb(error));

      try {
        await controller.getRanking();
        fail('should have thrown an error');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response).toEqual({
          code: 404,
          message: "Le classement n'est pas disponible car aucun joueur n'existe"
        });
      }
    });

    it('should handle ranking service error', async () => {
      const error = new Error('Service error');
      jest.spyOn(rankingService, 'getRanking').mockImplementation(cb => cb(error));

      await expect(controller.getRanking()).rejects.toEqual(error);
    });
  });

  describe('subscribeToRankingUpdates', () => {
    it('should return ranking updates observable', () => {
      const messageEvent = new MessageEvent('message', {
        data: {
          type: 'RankingUpdate',
          player: { id: 'player1', rank: 1200 }
        }
      });
      jest.spyOn(rankingService, 'getRankingUpdates').mockReturnValue(of(messageEvent));

      const result = controller.subscribeToRankingUpdates();
      expect(result).toBeInstanceOf(Observable);
    });
  });
});