export type Product = {
  id: string,
  name_raw: string,
  name_processed: string,
  sku: string,
  description_raw: string,
  description_processed: string,
  price: number,
  currency_price: number;
  now_price: number,
  suggested_price: number,
  is_collect: boolean,
  add_mark_status: boolean,
  last_enrichment_at: Date|null,
  ai_images_at: Date|null,
  ai_texts_at: Date|null,
  ai_status: string,
  big_image?: ProductImageType,
  images?: ProductImageType[],
  slug: string,
  warehouse_inventory_num: number,
  raw_data: string,
  external_id: string,
  product_weight: string,
  packing_weight: string,
  variants: ProductVariant[];
  cheapest_variant: ProductVariant,
  translation: ProductTranslation | null
  translations: ProductTranslation[]
}

export type ProductImageType = {
  id: string,
  url: string,
  original_url: string,
  ai_url: string,
  position: number,
  status: string
}

export type Meta = {
  total: number,
  per_page: number,
  current_page: number,
  last_page: number,
  from: number,
  to: number
}

export type ProductTranslation = {
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
    currency_price: number;
    stock: number;
    weight: string;
    volume: string;
    image?: ProductImageType;
    translations: ProductVariantTranslation[]
    ai_status: string
}

export type ProductVariantTranslation = {
    locale: string
    name: string
    product_variant_id: number
}
