import type { APIRoute } from 'astro'
import type { GiphyResponse } from '@/types/giphy'
import axios from 'axios'

const GIPHY_API_KEY = import.meta.env.GIPHY_API_KEY
const GIPHY_SEARCH_URL = 'https://api.giphy.com/v1/gifs/search'

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q')
  const limit = url.searchParams.get('limit') || '10'
  const offset = url.searchParams.get('offset') || '0'

  if (!query) {
    return new Response(JSON.stringify({ error: 'Query is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const response = await axios.get<GiphyResponse>(GIPHY_SEARCH_URL, {
      params: {
        api_key: GIPHY_API_KEY,
        q: query,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    })

    return new Response(JSON.stringify(response.data.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching Giphy data', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch GIFs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
