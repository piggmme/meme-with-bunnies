import type { GiphyGif } from '@/types/giphy'

interface fetchGifsOptions {
  query: string
  limit?: number
}

export const fetchGifs = async (options: fetchGifsOptions) => {
  const { query, limit = 10 } = options
  if (!query) return

  try {
    const response = await fetch(`/api/gifs?q=${encodeURIComponent(query)}&limit=${limit}`)
    if (!response.ok) {
      throw new Error('Failed to fetch GIFs')
    }
    const data = await response.json() as GiphyGif[]
    return data
  } catch (error) {
    console.error('Error fetching Giphy data', error)
    throw error
  }
}
