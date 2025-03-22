import { useState } from 'react'

export interface PaginationOptions {
  query: string
  limit?: number
  offset?: number
}
const usePagination = <T>(fetcher: (options: PaginationOptions) => Promise<T[] | undefined>) => {
  const [items, setItems] = useState<T[]>([])
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)
  const [currentQuery, setCurrentQuery] = useState('')

  const fetchMore = async (query: string, limit = 10) => {
    setLoading(true)
    if (query !== currentQuery) {
      setCurrentQuery(query)
      const response = await fetcher({ query, limit, offset: 0 })
      const newItems = response || []
      setItems(newItems)
      setOffset(limit)
    } else {
      const response = await fetcher({ query, limit, offset })
      const newItems = response || []
      setItems([...items, ...newItems])
      setOffset(offset + limit)
    }
    setLoading(false)
  }

  return { items, fetchMore, loading }
}

export default usePagination
