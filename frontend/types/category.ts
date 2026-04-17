interface CategoryInterface {
  id: number,
  name: string,
  external_id: string
  provider: string
  parent_id?: number;
  children?: Category[];
}

export type Category = CategoryInterface
