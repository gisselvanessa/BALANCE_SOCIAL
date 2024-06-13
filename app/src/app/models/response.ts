export interface ResponseModel {
  message: string,
  page: number,
  perPage: number,
  totalPages: number,
  totalCount: number,
  data: []
}