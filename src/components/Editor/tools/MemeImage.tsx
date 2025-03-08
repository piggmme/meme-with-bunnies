import { Image, type KonvaNodeEvents } from 'react-konva'
import type { EditorImage } from '../types/Editor'
import { Image as KonvaImage } from 'konva/lib/shapes/Image'
import { useEffect, useMemo, useRef } from 'react'

interface MemeImageProps {
  image: EditorImage
  onClick?: KonvaNodeEvents['onClick']
}

export default function MemeImage ({
  image,
  onClick,
}: MemeImageProps) {
  const imageRef = useRef<KonvaImage>(null)
  const imageCanvas = useMemo(() => {
    const node = document.createElement('canvas')
    return node
  }, [])

  useEffect(() => {
    if (image.type === 'image') return
    // save animation instance to stop it on unmount
    let anim
    window.gifler(image.src).get((a) => {
      anim = a
      anim.animateInCanvas(imageCanvas)
      anim.onDrawFrame = (ctx, frame) => {
        ctx.drawImage(frame.buffer, frame.x, frame.y)
        imageRef.current?.getLayer()?.draw()
      }
    })
    return () => anim.stop()
  }, [image.src, imageCanvas])

  return (
    <>
      <Image
        key={image.id}
        image={image.type === 'gif' ? imageCanvas : image.image}
        width={image.size.width}
        height={image.size.height}
        draggable
        onClick={onClick}
        ref={imageRef}
      />
    </>
  )
}
