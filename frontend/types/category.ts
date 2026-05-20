interface CategoryInterface {
  id: number,
  name: string,
  external_id: string
  provider: string
  parent_id?: number;
  children?: Category[];
  active: boolean,
  slug: string
}

export type Category = CategoryInterface
