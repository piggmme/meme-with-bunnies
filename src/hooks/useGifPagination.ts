import type { GiphyGif } from '@/types/giphy'
import type { PaginationOptions } from '@/hooks/usePagination'
import usePagination from '@/hooks/usePagination'
import { fetchGifs } from '@/service/giphy'

export default function useGifPagination () {
  return usePagination<GiphyGif>(async (option: PaginationOptions) => {
    const response = await fetchGifs(option)
    return response?.data
  })
}
