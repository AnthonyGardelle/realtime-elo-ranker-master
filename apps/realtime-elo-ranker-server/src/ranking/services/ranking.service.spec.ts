import { Test, TestingModule } from '@nestjs/testing';
import { RankingService } from './ranking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../../player/entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from '../../player/services/player.service';
import { EventsService } from '../../events/services/events.service';
import { NotFoundException } from '@nestjs/common';

describe('RankingService', () => {
  let service: RankingService;
  let playerService: PlayerService;
  let eventsService: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<RankingService>(RankingService);
    playerService = module.get<PlayerService>(PlayerService);
    eventsService = module.get<EventsService>(EventsService);
  });

  describe('getRanking', () => {
    it('should get initialized ranking', () => {
      const players = [
        { id: 'player1', rank: 1200 },
        { id: 'player2', rank: 1000 }
      ];
      jest.spyOn(playerService, 'findAll').mockImplementation(cb => cb(null, players));

      service['initializeRankings']();

      service.getRanking((error, ranking) => {
        expect(error).toBeNull();
        expect(ranking).toEqual([
          { id: 'player1', rank: 1200 },
          { id: 'player2', rank: 1000 }
        ]);
      });
    });
  });

  describe('updateRanking', () => {
    it('should update existing player rank', () => {
      const player = { id: 'player1', rank: 1000 };
      service['rankings'] = [player];

      service.updateRanking({ id: 'player1', rank: 1200 } as Player);

      service.getRanking((error, ranking) => {
        expect(ranking![0].rank).toBe(1200);
      });
    });

    it('should add new player', () => {
      const player = { id: 'player1', rank: 1000 };
      service.updateRanking(player as Player);

      service.getRanking((error, ranking) => {
        expect(ranking).toEqual([player]);
      });
    });

    it('should maintain sorted order', () => {
      service.updateRanking({ id: 'player1', rank: 1000 } as Player);
      service.updateRanking({ id: 'player2', rank: 1200 } as Player);

      service.getRanking((error, ranking) => {
        expect(ranking).toEqual([
          { id: 'player2', rank: 1200 },
          { id: 'player1', rank: 1000 }
        ]);
      });
    });
  });

  describe('getRankingUpdates', () => {
    it('should return observable of ranking updates', (done) => {
      const updateEvent = { id: 'player1', rank: 1200 };
      const emitter = eventsService.getRankingEmitter();
      const subscription = service.getRankingUpdates().subscribe(event => {
        expect(event.data).toEqual({
          type: 'RankingUpdate',
          player: updateEvent
        });
        subscription.unsubscribe();
        done();
      });

      emitter.emit('rankingUpdate', updateEvent);
    });
  });
});