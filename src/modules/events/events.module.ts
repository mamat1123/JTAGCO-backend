import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { SharedModule } from '../../shared/shared.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [SharedModule, ProfilesModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {} 