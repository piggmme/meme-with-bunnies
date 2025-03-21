import { useEffect, useState } from 'react'
import { fetchGifs } from '@/service/giphy'
import type { GiphyGif } from '@/types/giphy'
import { $canvasImages } from '@/stores/canvasState'
import { getImageSize } from '@/utils/editor'
import GiphyFilter from './GiphyFilter'
import { useActiveQuery } from '@/stores/giphyState'

export default function GiphyList () {
  const [activeQuery] = useActiveQuery()
  const [gifs, setGifs] = useState<GiphyGif[]>([])

  useEffect(() => {
    fetchGifs({ query: activeQuery }).then((results) => {
      if (results) setGifs(results)
    })
  }, [activeQuery])

  return (
    <div style={{ overflow: 'scroll', overscrollBehavior: 'contain' }}>
      <GiphyFilter />

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
