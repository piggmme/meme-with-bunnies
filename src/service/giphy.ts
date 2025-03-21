import type { GiphyGif } from '@/types/giphy'
import axios from './axios'
import type { PaginationOptions } from '@/hooks/usePagination'

export const fetchGifs = async (options: PaginationOptions) => {
  const { query, limit = 10, offset = 0 } = options
  if (!query) return

  return await axios.get<GiphyGif[]>(`/api/gifs/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`)
}

export const fetchStickers = async (options: PaginationOptions) => {
  const { query, limit = 10, offset = 0 } = options
  if (!query) return

  return await axios.get<GiphyGif[]>(`/api/stickers/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`)
}
