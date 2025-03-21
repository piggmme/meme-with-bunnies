import { useGiphys } from '@/service/giphy'
import { $canvasImages } from '@/stores/canvasState'
import { getImageSize } from '@/utils/editor'

export default function GiphyList () {
  const { data: gifs, loading, error } = useGiphys()

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
    </div>
  )
}
