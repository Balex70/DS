export type Log = {
  id: number,
  level: string,
  realm: string,
  message: string,
  created_at: Date|null
}

export type Meta = {
  total: number,
  per_page: number,
  current_page: number,
  last_page: number,
  from: number,
  to: number
}
