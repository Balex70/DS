interface ProductInterface {
  id: string,
  name_raw: string,
  name_processed: string,
  price: number,
  now_price: number,
  is_collect: boolean,
  add_mark_status: boolean,
  last_enrichment_at: Date|null,
  ai_processed_at: Date|null
}

export type Product = ProductInterface
