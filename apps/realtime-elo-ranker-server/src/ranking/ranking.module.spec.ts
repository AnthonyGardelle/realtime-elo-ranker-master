import { Test, TestingModule } from '@nestjs/testing';
import { RankingModule } from './ranking.module';
import { RankingService } from './services/ranking.service';
import { RankingController } from './controllers/ranking.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../player/entities/player.entity';
import { PlayerService } from '../player/services/player.service';
import { EventsService } from '../events/services/events.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('RankingModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Player],
          synchronize: true,
        }),
        RankingModule
      ],
      providers: [
        {
          provide: getRepositoryToken(Player),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn(),
            save: jest.fn()
          }
        },
        PlayerService,
        EventsService,
        EventEmitter2
      ]
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide RankingService', () => {
    const service = module.get<RankingService>(RankingService);
    expect(service).toBeInstanceOf(RankingService);
  });

  it('should provide RankingController', () => {
    const controller = module.get<RankingController>(RankingController);
    expect(controller).toBeInstanceOf(RankingController);
  });
});