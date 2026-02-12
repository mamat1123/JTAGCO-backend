import { Module } from '@nestjs/common';
import { ShoeReturnsService } from './shoe-returns.service';
import { ShoeReturnsController } from './shoe-returns.controller';
import { SharedModule } from '../../shared/shared.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [SharedModule, ProfilesModule],
  controllers: [ShoeReturnsController],
  providers: [ShoeReturnsService],
  exports: [ShoeReturnsService],
})
export class ShoeReturnsModule {}
