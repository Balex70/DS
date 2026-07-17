export type CartItemPayload = {
  product_id: string;
  vid: string;
  title: string;
  sku: string;
  quantity: number;
  price: number;
  currency_price?: number;
  image?: string;
  product_weight?: string;
  packing_weight?: string;
}
