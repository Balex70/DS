export type Job = {
  id: number,
  queue: string,
  payload: string,
  attempts: number,
  reserved_at: Date|null
  available_at: Date|null
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
