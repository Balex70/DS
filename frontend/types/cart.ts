interface CartItemPayloadInterface {
  product_id?: string;
  title: string;
  quantity: number;
  price: number;
}

export type CartItemPayload = CartItemPayloadInterface
