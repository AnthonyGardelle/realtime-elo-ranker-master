import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from '../controllers/ranking.controller';
import { RankingService } from '../services/ranking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../../player/entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('RankingController', () => {
  let controller: RankingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        RankingService,
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});