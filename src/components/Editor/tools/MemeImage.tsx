import { Image, type KonvaNodeEvents } from 'react-konva'
import type { EditorImage } from '../types/Editor'
import { Image as KonvaImage } from 'konva/lib/shapes/Image'
import { useEffect } from 'react'

interface MemeImageProps {
  image: EditorImage
  onClick?: KonvaNodeEvents['onClick']
}

export default function MemeImage ({
  image,
  onClick,
  ref,
}: MemeImageProps & { ref: (id: string, element?: KonvaImage) => KonvaImage | undefined }) {
  useEffect(() => {
    const imageRef = ref(image.id)
    if (image.image instanceof HTMLImageElement) return
    // save animation instance to stop it on unmount
    let anim
    window.gifler(image.src).get((a) => {
      anim = a
      anim.animateInCanvas(image.image)
      anim.onDrawFrame = (ctx, frame) => {
        ctx.drawImage(frame.buffer, frame.x, frame.y)
        if (imageRef) imageRef.getLayer()?.draw()
      }
    })
    return () => anim.stop()
  }, [image.src, image.image])

  return (
    <Image
      key={image.id}
      image={image.image}
      width={image.width}
      height={image.height}
      draggable
      onClick={onClick}
      ref={(el) => { if (el) ref?.(image.id, el) }}
    />
  )
}
