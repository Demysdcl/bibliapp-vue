export const createPagination = (list, currentPage) => {
  const pagination = {}
  pagination.total = list.length
  pagination.per_page = 10
  pagination.currentPage = currentPage
  pagination.total_pages = Math.ceil(pagination.total / pagination.per_page)
  return pagination
}

export const createPage = (list, pagination, currentPage) => {
  let fin = currentPage * pagination.per_page
  const ini = fin - pagination.per_page
  if (fin > list.length) {
    fin = list.length
  }
  return list.slice(ini, fin)
}
