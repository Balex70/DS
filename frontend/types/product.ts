interface ProductInterface {
  id: string,
  name_raw: string,
  name_processed: string,
  price: number,
  now_price: number,
  is_collect: boolean,
  add_mark_status: boolean
}

export type Product = ProductInterface
