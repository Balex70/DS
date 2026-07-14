interface ProductInterface {
  id: string,
  name_raw: string,
  name_processed: string,
  sku: string,
  description_raw: string,
  description_processed: string,
  price: number,
  now_price: number,
  suggested_price: number,
  is_collect: boolean,
  add_mark_status: boolean,
  last_enrichment_at: Date|null,
  ai_images_at: Date|null,
  ai_texts_at: Date|null,
  ai_status: string,
  big_image?: ProductImageInterface,
  images?: ProductImageInterface[],
  slug: string,
  warehouse_inventory_num: number,
  raw_data: string,
  external_id: string,
  product_weight: string,
  packing_weight: string,
  variants: ProductVariant[];
  cheapest_variant: ProductVariant,
  translation: ProductTranslationInterface | null
  translations: ProductTranslationInterface[]
}

interface ProductImageInterface {
  id: string,
  url: string,
  original_url: string,
  ai_url: string,
  position: number,
  status: string
}

interface MetaInterface {
  total: number,
  per_page: number,
  current_page: number,
  last_page: number,
  from: number,
  to: number
}

interface ProductTranslationInterface {
  locale: string,
  name: string,
  description: string,
}

export type ProductVariant = {
    id: string;
    product_id: string;
    external_id: string;
    sku: string;
    name: string;
    name_processed: string;
    key: string;
    price: number;
    stock: number;
    weight: string;
    volume: string;
    image?: ProductImageInterface;
    translations: ProductVariantTranslation[]
    ai_status: string
}

export type ProductTranslation = {
    name: string
    description: string
}

export type ProductVariantTranslation = {
    locale: string
    name: string
    product_variant_id: number
}

export type Product = ProductInterface
export type Meta = MetaInterface
export type ProductImageType = ProductImageInterface
