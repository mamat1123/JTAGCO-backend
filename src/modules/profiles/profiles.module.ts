import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard } from '../../guards/auth.guard';

@Module({
  imports: [SharedModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, AuthGuard],
  exports: [ProfilesService]
})
export class ProfilesModule {} 