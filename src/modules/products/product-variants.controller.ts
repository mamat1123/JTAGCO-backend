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
import { ProductVariantsService } from './product-variants.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductVariant } from './entities/product-variant.entity';
import { SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { Request as ExpressRequest } from 'express';
import { User } from '@supabase/supabase-js';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@Controller('product-variants')
@UseGuards(SupabaseAuthGuard)
export class ProductVariantsController {
  constructor(private readonly productVariantsService: ProductVariantsService) {}

  private getToken(req: RequestWithUser): string {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('No authorization token provided');
    }
    return token;
  }

  @Post()
  async create(
    @Body() createProductVariantDto: CreateProductVariantDto,
    @Req() req: RequestWithUser,
  ): Promise<ProductVariant> {
    const token = this.getToken(req);
    return await this.productVariantsService.create(createProductVariantDto, token);
  }

  @Post('multiple')
  async createMultiple(
    @Body() input: any,
    @Req() req: RequestWithUser,
  ): Promise<ProductVariant[]> {
    const token = this.getToken(req);
    return await this.productVariantsService.createMultipleVariants(input, token);
  }

  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<ProductVariant[]> {
    const token = this.getToken(req);
    return await this.productVariantsService.findAll(token);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<ProductVariant> {
    const token = this.getToken(req);
    return await this.productVariantsService.findOne(id, token);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
    @Req() req: RequestWithUser,
  ): Promise<ProductVariant> {
    const token = this.getToken(req);
    return await this.productVariantsService.update(id, updateProductVariantDto, token);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    const token = this.getToken(req);
    await this.productVariantsService.remove(id, token);
  }
} 