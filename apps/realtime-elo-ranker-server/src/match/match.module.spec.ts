import { Test, TestingModule } from '@nestjs/testing';
import { MatchModule } from './match.module';
import { MatchService } from './services/match.service';
import { MatchController } from './controllers/match.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Player } from '../player/entities/player.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from '../player/player.module';

describe('MatchModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Match, Player],
          synchronize: true,
        }),
        PlayerModule,
        MatchModule
      ]
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide MatchService', () => {
    const service = module.get<MatchService>(MatchService);
    expect(service).toBeInstanceOf(MatchService);
  });

  it('should provide MatchController', () => {
    const controller = module.get<MatchController>(MatchController);
    expect(controller).toBeInstanceOf(MatchController);
  });
});