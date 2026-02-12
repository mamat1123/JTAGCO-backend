import { Module } from '@nestjs/common';
import { BusinessTypesController } from './business-types.controller';
import { BusinessTypesService } from './business-types.service';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [BusinessTypesController],
  providers: [BusinessTypesService],
  exports: [BusinessTypesService],
})
export class BusinessTypesModule {}
