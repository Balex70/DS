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
  is_visible: boolean,
  slug: string,
  image: string,
  full_path: string,
  meta_title: string,
  meta_description: string
  translations: {
    locale: string,
    name: string,
    description: string
    meta_title: string,
    meta_description: string
  }[],
  products?: Product[]
}

export type SortSelectValue = "latest" | "price_asc" | "price_desc";
export type CategoryEditableFields = "name" | "description" | "meta_title" | "meta_description";
