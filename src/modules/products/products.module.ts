import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsController } from './product-variants.controller';

@Module({
  controllers: [ProductsController, ProductVariantsController],
  providers: [ProductsService, ProductVariantsService],
  exports: [ProductsService, ProductVariantsService],
})
export class ProductsModule {} 