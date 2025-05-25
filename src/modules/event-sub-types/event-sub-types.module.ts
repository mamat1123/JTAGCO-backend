import { Module } from '@nestjs/common';
import { EventSubTypesController } from './event-sub-types.controller';
import { EventSubTypesService } from './event-sub-types.service';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [EventSubTypesController],
  providers: [EventSubTypesService],
  exports: [EventSubTypesService],
})
export class EventSubTypesModule {} 