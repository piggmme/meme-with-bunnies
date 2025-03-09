import { useState } from 'react'
import { fetchGifs } from '@/service/giphy'
import type { GiphyGif } from '@/types/giphy'
import { $editorImages } from '@/stores/editorState'

export default function GiphySearch () {
  const [query, setQuery] = useState('')
  const [gifs, setGifs] = useState<GiphyGif[]>([])

  return (
    <div>
      <input
        type='text'
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder='Search for GIFs'
      />
      <button onClick={async () => {
        if (!query) return
        const results = await fetchGifs({ query })
        if (results) setGifs(results)
      }}
      >Search
      </button>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
        {gifs.map(gif => (
          <img
            key={gif.id}
            src={gif.images.fixed_height.url}
            alt={gif.title}
            style={{ width: '150px', margin: '5px' }}
            onClick={() => {
              $editorImages.set([
                ...$editorImages.get(),
                {
                  type: 'gif',
                  id: gif.id,
                  src: gif.images.original.url,
                  size: {
                    width: Number(gif.images.original.width),
                    height: Number(gif.images.original.height),
                  },
                },
              ])
            }}
          />
        ))}
      </div>
    </div>
  )
}
