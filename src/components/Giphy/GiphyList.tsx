import { useEffect, useState } from 'react'
import { fetchGifs } from '@/service/giphy'
import type { GiphyGif } from '@/types/giphy'
import { $canvasImages } from '@/stores/canvasState'
import { getImageSize } from '@/utils/editor'
import { Button } from '../ui/button'

export default function GiphyList () {
  const [query, setQuery] = useState('bear')
  const [gifs, setGifs] = useState<GiphyGif[]>([])

  useEffect(() => {
    fetchGifs({ query }).then((results) => {
      if (results) setGifs(results)
    })
  }, [query])

  return (
    <div style={{ overflow: 'scroll', overscrollBehavior: 'contain' }}>
      <div className='sticky top-0 left-0 z-50 flex gap-2 p-2 bg-background'>
        {njzs.map(njz => (
          <Button
            variant='outline'
            key={njz.name}
            className='text-2xl'
            onClick={() => {
              setQuery(njz.name)
            }}
          >{njz.emoji}
          </Button>
        ))}
      </div>

      <ul className='flex flex-wrap gap-2 p-2'>
        {gifs.map(gif => (
          <li>
            <img
              key={gif.id}
              src={gif.images.fixed_height.url}
              alt={gif.title}
              className='w-30 h-20 object-cover rounded-sm'
              onClick={() => {
                $canvasImages.set([
                  ...$canvasImages.get(),
                  {
                    type: 'gif',
                    id: gif.id + String(Date.now()),
                    src: gif.images.original.url,
                    size: getImageSize({
                      width: Number(gif.images.original.width),
                      height: Number(gif.images.original.height),
                    }),
                  },
                ])
              }}
            />
          </li>
        ))}
      </ul>

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
