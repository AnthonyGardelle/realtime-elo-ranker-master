import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerService } from '../player/services/player.service';
import { PlayerController } from '../player/controllers/player.controller';
import { Player } from './entities/player.entity';
import { EventsModule } from '../events/events.module';

@Module({
  controllers: [PlayerController],
  imports: [
    TypeOrmModule.forFeature([Player]),
    EventsModule,
  ],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule { }