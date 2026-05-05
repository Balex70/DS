interface ProductInterface {
  id: string,
  name_raw: string,
  name_processed: string,
  price: number,
  now_price: number,
  is_collect: boolean,
  add_mark_status: boolean,
  last_enrichment_at: Date|null,
  ai_processed_at: Date|null,
  big_image: string,
  images: ProductImageInterface[],
}

interface ProductImageInterface {
  id: string,
  url: string,
  original_url: string,
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
