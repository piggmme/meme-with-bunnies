import type { GiphyGif } from '@/types/giphy'
import { nanoquery } from '@nanostores/query'
import axios from 'axios'
import { $activeQuery } from '@/stores/giphyState'
import { useStore } from '@nanostores/react'

const [
  createGiphyFetcherStore, createGiphyMutator,
] = nanoquery({
  fetcher: async <T>(...keys) => {
    const [url, query] = keys
    if (!query) return
    if (query === '') return
    const { data } = await axios.get<T>(`${url}?q=${encodeURIComponent(query)}&limit=10`)
    return data
  },
  onError: (error) => {
    console.error('Error fetching Giphy data', error)
  },
  onErrorRetry: null,
})

export const $giphyState = createGiphyFetcherStore<GiphyGif[]>(['/api/gifs', $activeQuery])

export function useGiphys () {
  const { data, loading, error } = useStore($giphyState)
  return { data, loading, error }
}
