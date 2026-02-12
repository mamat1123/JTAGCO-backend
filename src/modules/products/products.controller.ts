import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariant } from './entities/product-variant.entity';
import { SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { Request as ExpressRequest } from 'express';
import { User } from '@supabase/supabase-js';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@Controller('products')
@UseGuards(SupabaseAuthGuard)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  private getToken(req: RequestWithUser): string {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('No authorization token provided');
    }
    return token;
  }

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: RequestWithUser,
  ): Promise<Product> {
    const token = this.getToken(req);
    return await this.productsService.create(createProductDto, token);
  }

  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<Product[]> {
    const token = this.getToken(req);
    return await this.productsService.findAll(token);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Product> {
    const token = this.getToken(req);
    return await this.productsService.findOne(id, token);
  }

  @Get(':id/variants')
  async findVariants(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<ProductVariant[]> {
    const token = this.getToken(req);
    await this.productsService.findOne(id, token); // Verify product exists
    return await this.productVariantsService.findByProductId(id, token);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: RequestWithUser,
  ): Promise<Product> {
    const token = this.getToken(req);
    return await this.productsService.update(id, updateProductDto, token);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    const token = this.getToken(req);
    await this.productsService.remove(id, token);
  }
}
