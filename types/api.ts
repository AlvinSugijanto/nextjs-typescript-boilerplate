export interface SingleItemResponse<T> {
  data: T
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
}
