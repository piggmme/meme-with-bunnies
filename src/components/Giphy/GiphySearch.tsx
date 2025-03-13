import { useEffect, useState } from 'react'
import { fetchGifs } from '@/service/giphy'
import type { GiphyGif } from '@/types/giphy'
import { $canvasImages } from '@/stores/canvasState'
import { getImageSize } from '@/utils/editor'

export default function GiphySearch () {
  const [query, setQuery] = useState('bear')
  const [gifs, setGifs] = useState<GiphyGif[]>([])

  useEffect(() => {
    fetchGifs({ query }).then((results) => {
      if (results) setGifs(results)
    })
  }, [query])

  return (
    <div>
      <div>
        {njzs.map(njz => (
          <button
            key={njz.name}
            onClick={() => {
              setQuery(njz.name)
            }}
          >{njz.emoji}
          </button>
        ))}
      </div>

      <div>
        <input
          type='text'
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Search for GIFs'
        />
        <button onClick={() => {
          setQuery(query)
        }}
        >Search
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
        {gifs.map(gif => (
          <img
            key={gif.id}
            src={gif.images.fixed_height.url}
            alt={gif.title}
            style={{ width: '150px', margin: '5px' }}
            onClick={() => {
              $canvasImages.set([
                ...$canvasImages.get(),
                {
                  type: 'gif',
                  id: gif.id,
                  src: gif.images.original.url,
                  size: getImageSize({
                    width: Number(gif.images.original.width),
                    height: Number(gif.images.original.height),
                  }),
                },
              ])
            }}
          />
        ))}
      </div>
    </div>
  )
}

const njzs = [
  {
    name: 'bear',
    emoji: '🐻',
  },
  {
    name: 'otter',
    emoji: '🦦',
  },
  {
    name: 'cat',
    emoji: '🐱',
  },
  {
    name: 'dog',
    emoji: '🐶',
  },
  {
    name: 'hamster',
    emoji: '🐹',
  },
]
