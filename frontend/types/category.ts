import { Product } from "./product"

export type Category = {
  id: number,
  name: string,
  description: string,
  external_id: string,
  provider: string,
  parent_id?: number,
  children?: Category[],
  active: boolean,
  slug: string,
  image: string,
  full_path: string,
  translations: {
    locale: string,
    name: string,
    description: string
  }[],
  products?: Product[]
}
