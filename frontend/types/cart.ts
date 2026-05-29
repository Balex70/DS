interface CartItemPayloadInterface {
  product_id: string;
  title: string;
  sku: string;
  quantity: number;
  price: number;
  image?: string;
  product_weight?: number;
  packing_weight?: number;
}

export type CartItemPayload = CartItemPayloadInterface
