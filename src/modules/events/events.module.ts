import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { SharedModule } from '../../shared/shared.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { ShoeRequestsModule } from '../shoe-requests/shoe-requests.module';

@Module({
  imports: [SharedModule, ProfilesModule, ShoeRequestsModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
