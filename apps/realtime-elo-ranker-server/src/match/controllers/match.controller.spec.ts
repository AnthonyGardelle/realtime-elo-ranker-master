import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from '../services/match.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from '../entities/match.entity';
import { Player } from '../../player/entities/player.entity';
import { PlayerService } from '../../player/services/player.service';
import { RankingService } from '../../ranking/services/ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('MatchController', () => {
  let controller: MatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        MatchService,
        PlayerService,
        RankingService,
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});