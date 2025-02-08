import { Test, TestingModule } from '@nestjs/testing';
import { RankingService } from '../services/ranking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../../player/entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('RankingService', () => {
  let service: RankingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<RankingService>(RankingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});