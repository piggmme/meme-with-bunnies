import type { GiphyResponse } from '@/types/giphy'
import axios from 'axios'

const GIPHY_API_KEY = import.meta.env.PUBLIC_GIPHY_API_KEY
const GIPHY_SEARCH_URL = 'https://api.giphy.com/v1/gifs/search'

interface fetchGifsOptions {
  query: string
  limit?: number
}

export const fetchGifs = async (options: fetchGifsOptions) => {
  const { query, limit = 10 } = options
  if (!query) return

  try {
    const response = await axios.get<GiphyResponse>(GIPHY_SEARCH_URL, {
      params: {
        api_key: GIPHY_API_KEY,
        q: query,
        limit,
      },
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching Giphy data', error)
    throw error
  }
}
