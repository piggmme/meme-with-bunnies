import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { useGifPagination } from '@/service/giphy'
import { $canvasImages } from '@/stores/canvasState'
import { $activeQuery } from '@/stores/giphyState'
import { getImageSize } from '@/utils/editor'
import { useStore } from '@nanostores/react'
import { useEffect } from 'react'

export default function GiphyList () {
  const activeQuery = useStore($activeQuery)
  const { items: gifs, fetchMore, loading } = useGifPagination()

  useEffect(function firstFetch () {
    fetchMore(activeQuery)
  }, [activeQuery])

  const fetchGifs = async () => {
    await fetchMore(activeQuery)
  }
  const ref = useInfiniteScroll(fetchGifs)

  return (
    <div className='overflow-scroll overscroll-contain'>
      <ul className='flex flex-wrap gap-2 p-2'>
        {gifs?.map(gif => (
          <li key={gif.id}>
            <img
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
      <div ref={ref} className='h-1 mb-2' />
    </div>
  )
}
