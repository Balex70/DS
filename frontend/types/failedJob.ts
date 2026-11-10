export type FailedJob = {
  id: number,
  queue: string,
  payload: string,
  exception: string,
  failed_at: Date|null
}

export type Meta = {
  total: number,
  per_page: number,
  current_page: number,
  last_page: number,
  from: number,
  to: number
}
