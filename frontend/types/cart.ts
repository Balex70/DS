interface CartItemPayloadInterface {
  product_id: string;
  title: string;
  sku: string;
  quantity: number;
  price: number;
  image?: string;
  product_weight?: string;
  packing_weight?: string;
}

export type CartItemPayload = CartItemPayloadInterface
