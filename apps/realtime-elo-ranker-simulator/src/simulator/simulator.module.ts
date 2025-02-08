import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SimulatorService } from './services/simulator.service';

@Module({
  imports: [HttpModule],
  providers: [SimulatorService]
})
export class SimulatorModule {}
