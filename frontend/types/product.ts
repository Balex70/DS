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
  packing_weight: string
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

export type Product = ProductInterface
export type Meta = MetaInterface
export type ProductImageType = ProductImageInterface
