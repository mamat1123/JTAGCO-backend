import { Module } from '@nestjs/common';
import { ShoeRequestsService } from './shoe-requests.service';
import { ShoeRequestsController } from './shoe-requests.controller';
import { SharedModule } from '../../shared/shared.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [SharedModule, ProfilesModule],
  controllers: [ShoeRequestsController],
  providers: [ShoeRequestsService],
  exports: [ShoeRequestsService],
})
export class ShoeRequestsModule {}
