import {
  Image, Transformer, Circle, Group, Path, type KonvaNodeEvents,
} from 'react-konva'
import type { EditorImage } from '../types/Editor'
import { Image as KonvaImage } from 'konva/lib/shapes/Image'
import { useEffect, useMemo, useRef, useState } from 'react'

interface MemeImageProps {
  image: EditorImage
  onClick?: KonvaNodeEvents['onClick']
  isSelected?: boolean
  onSelect: (id: string) => void
  onDelete?: (id: string) => void
}

export default function MemeImage ({
  image,
  onClick,
  isSelected = false,
  onSelect,
  onDelete,
}: MemeImageProps) {
  const trRef = useRef<any>(null)
  const imageRef = useRef<KonvaImage>(null)
  const imageCanvas = useMemo(() => {
    const node = document.createElement('canvas')
    return node
  }, [])

  const [imageProps, setImageProps] = useState({
    x: 0,
    y: 0,
    width: image.size.width,
    height: image.size.height,
    rotation: 0,
  })

  // 초기 위치 설정
  useEffect(() => {
    if (imageRef.current) {
      setImageProps({
        x: imageRef.current.x(),
        y: imageRef.current.y(),
        width: imageRef.current.width(),
        height: imageRef.current.height(),
        rotation: imageRef.current.rotation(),
      })
    }
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

  const deleteButtonSize = 24
  const DeleteIcon = () => (
    <Path
      data='M18 6L6 18M6 6l12 12'
      stroke='#ffffff'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      // SVG viewBox를 Konva 좌표로 변환
      offsetX={12}
      offsetY={12}
    />
  )

  const deleteButtonPosition = useMemo(() => {
    const rad = (imageProps.rotation * Math.PI) / 180
    const dx = imageProps.width * Math.cos(rad)
    const dy = imageProps.width * Math.sin(rad)

    return {
      x: imageProps.x + dx,
      y: imageProps.y + dy,
    }
  }, [imageProps])

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
        onDragMove={(e) => {
          const node = e.target
          setImageProps(prev => ({
            ...prev,
            x: node.x(),
            y: node.y(),
          }))
        }}
        onTransform={(e) => {
          const node = e.target
          setImageProps({
            x: node.x(),
            y: node.y(),
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
            rotation: node.rotation(),
          })
        }}
        ref={imageRef}
      />
      {isSelected && (
        <>
          <Transformer
            ref={trRef}
            enabledAnchors={['bottom-right']}
            boundBoxFunc={(oldBox, newBox) => {
              // 최소 크기 제한
              const minSize = 20
              const isToSmall = Math.abs(newBox.width) < minSize || Math.abs(newBox.height) < minSize
              return isToSmall ? oldBox : newBox
            }}
            borderDash={[6, 2]}
            borderStroke='#4482ff'
            anchorCornerRadius={10}
            anchorStroke='#4482ff'
            anchorFill='#ccddff'
          />
          <Group
            x={deleteButtonPosition.x}
            y={deleteButtonPosition.y}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container()
              if (container) {
                container.style.cursor = 'pointer'
              }
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container()
              if (container) {
                container.style.cursor = 'default'
              }
            }}
          >
            <Circle
              radius={deleteButtonSize / 2}
              fill='#FF4444'
              onClick={() => onDelete?.(image.id)}
              listening={true}
            />
            <DeleteIcon />
          </Group>
        </>
      )}
    </>
  )
}
