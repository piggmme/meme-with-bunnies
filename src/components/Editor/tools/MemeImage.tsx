import {
  Image, Transformer, Circle, Group, Path, type KonvaNodeEvents,
} from 'react-konva'
import type { EditorImage } from '../types/Editor'
import { Image as KonvaImage } from 'konva/lib/shapes/Image'
import {
  useEffect, useMemo, useRef, useState, type RefObject,
} from 'react'

interface MemeImageProps {
  image: EditorImage
  onClick?: KonvaNodeEvents['onClick']
  isSelected?: boolean
  onSelect: (id: string) => void
  onDelete?: (id: string) => void
  moveToTop?: (id: string) => void // 추가
}

interface ImageInfo {
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

const CONTROL_BUTTON_SIZE = 24

export default function MemeImage ({
  image,
  onClick,
  isSelected = false,
  onSelect,
  onDelete,
  moveToTop,
}: MemeImageProps) {
  const trRef = useRef<any>(null)
  const imageRef = useRef<KonvaImage>(null)
  const imageCanvas = useMemo(() => {
    const node = document.createElement('canvas')
    return node
  }, [])

  const [imageInfo, setImageInfo] = useState<ImageInfo>({
    x: 0,
    y: 0,
    width: image.size.width,
    height: image.size.height,
    rotation: 0,
  })

  // 초기 위치 설정
  useEffect(() => {
    if (imageRef.current) {
      setImageInfo({
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
          setImageInfo(prev => ({
            ...prev,
            x: node.x(),
            y: node.y(),
          }))
        }}
        onTransform={(e) => {
          const node = e.target
          setImageInfo({
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
        <ImageTransformer
          ref={trRef}
          image={image}
          imageInfo={imageInfo}
          onDelete={onDelete}
          moveToTop={moveToTop}
        />
      )}
    </>
  )
}

function ImageTransformer ({
  image,
  ref,
  imageInfo,
  onDelete,
  moveToTop,
}: {
  image: EditorImage
  ref: RefObject<any>
  imageInfo: ImageInfo
  onDelete?: (id: string) => void
  moveToTop?: (id: string) => void
}) {
  const deleteButtonPosition = useMemo(() => {
    const rad = (imageInfo.rotation * Math.PI) / 180
    const dx = imageInfo.width * Math.cos(rad)
    const dy = imageInfo.width * Math.sin(rad)

    return {
      x: imageInfo.x + dx,
      y: imageInfo.y + dy,
    }
  }, [imageInfo])

  const moveToTopButtonPosition = useMemo(() => {
    const rad = (imageInfo.rotation * Math.PI) / 180

    // 이미지의 왼쪽 하단 좌표를 회전 변환
    const dx = 0
    const dy = imageInfo.height

    // 회전된 좌표 계산
    const rotatedX = dx * Math.cos(rad) - dy * Math.sin(rad)
    const rotatedY = dx * Math.sin(rad) + dy * Math.cos(rad)

    return {
      x: imageInfo.x + rotatedX,
      y: imageInfo.y + rotatedY,
    }
  }, [imageInfo])

  return (
    <>
      <Transformer
        ref={ref}
        enabledAnchors={['bottom-right']}
        boundBoxFunc={(oldBox, newBox) => {
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
      <ControlButton
        x={deleteButtonPosition.x}
        y={deleteButtonPosition.y}
        fill='#FF4444'
        onControl={() => onDelete?.(image.id)}
      >
        <DeleteIcon />
      </ControlButton>

      <ControlButton
        x={moveToTopButtonPosition.x}
        y={moveToTopButtonPosition.y}
        fill='#77c477'
        onControl={() => moveToTop?.(image.id)}
      >
        <MoveToTopIcon />
      </ControlButton>
    </>
  )
}

function ControlButton ({
  x,
  y,
  fill,
  onControl,
  children,
}: {
  x: number
  y: number
  fill: string
  onControl: () => void
  children: React.ReactNode
}) {
  return (
    <Group x={x} y={y}>
      <Circle
        radius={CONTROL_BUTTON_SIZE / 2}
        fill={fill}
        onClick={onControl}
        onTouchEnd={onControl}
      />
      {children}
    </Group>
  )
}

function DeleteIcon () {
  return (
    <Path
      data='M18 6L6 18M6 6l12 12'
      stroke='#ffffff'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      offsetX={12}
      offsetY={12}
      scaleX={0.7}
      scaleY={0.7}
    />
  )
}

function MoveToTopIcon () {
  return (
    <Path
      data='M12 4L4 12M12 4L20 12M12 4V20'
      stroke='#ffffff'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      offsetX={12}
      offsetY={12}
      scaleX={0.7}
      scaleY={0.7}
    />
  )
}
