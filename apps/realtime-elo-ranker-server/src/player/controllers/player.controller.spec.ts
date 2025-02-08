import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from '../services/player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { RankingService } from '../../ranking/services/ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('PlayerController', () => {
  let controller: PlayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
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

    controller = module.get<PlayerController>(PlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});