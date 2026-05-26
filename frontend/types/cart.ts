interface CartItemPayloadInterface {
  product_id: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

export type CartItemPayload = CartItemPayloadInterface
