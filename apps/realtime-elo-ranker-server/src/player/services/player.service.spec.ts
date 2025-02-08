import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { RankingService } from '../../ranking/services/ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
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

    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});