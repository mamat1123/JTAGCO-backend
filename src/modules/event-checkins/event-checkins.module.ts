import { Module } from '@nestjs/common';
import { EventCheckinsController } from './event-checkins.controller';
import { EventCheckinsService } from './event-checkins.service';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [EventCheckinsController],
  providers: [EventCheckinsService],
  exports: [EventCheckinsService],
})
export class EventCheckinsModule {} 