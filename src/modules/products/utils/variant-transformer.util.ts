import { CreateProductVariantDto } from '../dto/create-product-variant.dto';

interface ColorAttribute {
  color: string;
  image: string;
}

interface InputVariantAttributes {
  colors?: ColorAttribute[];
  size?: string;
  steel_plate?: string;
  [key: string]: any;
}

interface InputVariant {
  product_id: string;
  sku: string;
  attributes: InputVariantAttributes;
  is_made_to_order: boolean;
  price: number;
  stock: number;
}

/**
 * Generates a unique SKU for a product variant
 * @param productId The product ID
 * @param color The color of the variant
 * @param size Optional size of the variant
 * @param index Sequential number to ensure uniqueness
 * @returns A formatted SKU string
 */
function generateSku(
  productId: string,
  color: string,
  size?: string,
  index: number = 1,
): string {
  const productPrefix = productId.slice(0, 4).toUpperCase();
  const colorCode = color.slice(0, 3).toUpperCase();
  const sizeCode = size ? `-${size.padStart(2, '0')}` : '';
  const sequence = index.toString().padStart(3, '0');

  return `${productPrefix}-${colorCode}${sizeCode}-${sequence}`;
}

/**
 * Transforms a single variant object into an array of variants based on color and size combinations
 * @param input The input variant object
 * @returns Array of CreateProductVariantDto objects
 */
export function transformVariantToCombinations(
  input: InputVariant,
): CreateProductVariantDto[] {
  const { product_id, attributes, is_made_to_order, price, stock } = input;
  const variants: CreateProductVariantDto[] = [];
  let variantIndex = 1;

  // If size is not provided, create variants only for colors
  if (!attributes.size) {
    if (
      attributes.colors &&
      Array.isArray(attributes.colors) &&
      attributes.colors.length > 0
    ) {
      // Create variants for each color without size
      for (const color of attributes.colors) {
        console.log(
          generateSku(product_id, color.color, undefined, variantIndex++),
        );
        variants.push({
          product_id: product_id,
          sku: generateSku(product_id, color.color, undefined, variantIndex++),
          attributes: {
            color: color.color,
            steel_plate: attributes.steel_plate,
            image: color.image,
          },
          is_made_to_order: is_made_to_order,
          price,
          stock,
        });
      }
    }
    return variants;
  }

  // Parse size range if size is provided
  const [minSize, maxSize] = attributes.size
    .split('-')
    .map((s) => parseInt(s.trim()));

  // Generate all size numbers in range
  const sizes = Array.from(
    { length: maxSize - minSize + 1 },
    (_, i) => minSize + i,
  );

  // If colors are provided, create variants for each color and size combination
  if (
    attributes.colors &&
    Array.isArray(attributes.colors) &&
    attributes.colors.length > 0
  ) {
    for (const color of attributes.colors) {
      for (const size of sizes) {
        console.log(
          generateSku(product_id, color.color, size.toString(), variantIndex++),
        );
        variants.push({
          product_id: product_id,
          sku: generateSku(
            product_id,
            color.color,
            size.toString(),
            variantIndex++,
          ),
          attributes: {
            color: color.color,
            size: size.toString(),
            steel_plate: attributes.steel_plate,
            image: color.image,
          },
          is_made_to_order: is_made_to_order,
          price,
          stock,
        });
      }
    }
  } else {
    // If no colors provided, create variants for each size only
    for (const size of sizes) {
      console.log(
        generateSku(product_id, 'DEF', size.toString(), variantIndex++),
      );
      variants.push({
        product_id: product_id,
        sku: generateSku(product_id, 'DEF', size.toString(), variantIndex++),
        attributes: {
          size: size.toString(),
          steel_plate: attributes.steel_plate,
        },
        is_made_to_order: is_made_to_order,
        price,
        stock,
      });
    }
  }

  return variants;
}
