import { Image, Transformer, type KonvaNodeEvents } from 'react-konva'
import type { EditorImage } from '../types/Editor'
import { Image as KonvaImage } from 'konva/lib/shapes/Image'
import { useEffect, useMemo, useRef } from 'react'

interface MemeImageProps {
  image: EditorImage
  onClick?: KonvaNodeEvents['onClick']
  isSelected?: boolean
  onSelect: (id: string) => void
}

export default function MemeImage ({
  image,
  onClick,
  isSelected = false,
  onSelect,
}: MemeImageProps) {
  const trRef = useRef<any>(null)
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

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([imageRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected, trRef.current])

  return (
    <>
      <Image
        key={image.id}
        image={image.type === 'gif' ? imageCanvas : image.image}
        width={image.size.width}
        height={image.size.height}
        draggable
        onClick={(e) => {
          e.cancelBubble = true
          onSelect(image.id)
          onClick?.(e)
        }}
        onTouchEnd={() => {
          onSelect(image.id)
        }}
        ref={imageRef}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}
