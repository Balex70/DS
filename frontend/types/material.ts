export type MaterialOption = {
    id: number,
    name: string,
    translation: {
        locale: string,
        name: string
    }
}

export type Material = {
    id: number,
    name: string
}

export type Meta = {
  total: number,
  per_page: number,
  current_page: number,
  last_page: number,
  from: number,
  to: number
}
