import { Stage, Layer, Rect } from 'react-konva'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import MemeImage from './MemeImage'
import { useStore } from '@nanostores/react'
import {
  $canvasClientSize,
  $canvasPosition, $canvasBackground, $canvasImages, useSelectImage,
  $canvasRatio,
} from '@/stores/canvasState'
import { useEffect } from 'react'
import { CANVAS_SIZE } from '@/constants/style'

export default function MemeCanvas ({
  stageRef,
  layerRef,
}: {
  stageRef: React.RefObject<KonvaStage | null>
  layerRef: React.RefObject<KonvaLayer | null>
}) {
  const canvasImages = useStore($canvasImages)
  const canvasBackground = useStore($canvasBackground)
  const { selectedId, selectImage, deselectImage } = useSelectImage()
  const canvasRatio = useStore($canvasRatio)

  const handleMoveToTop = (id: string) => {
    const imageIndex = canvasImages.findIndex(img => img.id === id)
    if (imageIndex !== canvasImages.length - 1) {
      const newImages = canvasImages.filter(img => img.id !== id)
      newImages.push(canvasImages[imageIndex])
      $canvasImages.set(newImages)
    }
  }

  useEffect(() => {
    const updatePosition = () => {
      const container = stageRef.current?.container()
      if (!container) return

      const rect = container.getBoundingClientRect()
      // 왼쪽 하단 좌표 계산
      const bottomLeft = {
        x: rect.left,
        y: rect.top + rect.height,
      }

      $canvasClientSize.set({ width: rect.width, height: rect.height })
      $canvasPosition.set(bottomLeft)
    }

    // 초기 위치 설정
    updatePosition()

    // 리사이즈 이벤트에서도 위치 업데이트
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [stageRef.current])

  return (
    <Stage
      width={CANVAS_SIZE * canvasRatio}
      height={CANVAS_SIZE * canvasRatio}
      ref={stageRef}
      onClick={deselectImage}
      scale={{ x: canvasRatio, y: canvasRatio }}
      style={{
        width: `${CANVAS_SIZE * canvasRatio}px`,
        height: `${CANVAS_SIZE * canvasRatio}px`,
      }}
      className='shadow-md flex items-center justify-center box-content'
    >
      <Layer ref={layerRef}>
        <Rect
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          fill={canvasBackground}
        />
        {
          canvasImages.map(image => (
            <MemeImage
              key={image.id}
              image={image}
              isSelected={image.id === selectedId}
              onSelect={selectImage}
              onDelete={id => $canvasImages.set(canvasImages.filter(image => image.id !== id))}
              moveToTop={handleMoveToTop}
            />
          ))
        }
      </Layer>
    </Stage>
  )
}
