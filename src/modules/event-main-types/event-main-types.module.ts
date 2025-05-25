import { Module } from '@nestjs/common';
import { EventMainTypesService } from './event-main-types.service';
import { EventMainTypesController } from './event-main-types.controller';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [EventMainTypesController],
  providers: [EventMainTypesService],
  exports: [EventMainTypesService],
})
export class EventMainTypesModule {} 