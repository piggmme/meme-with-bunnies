import { Stage, Layer, Rect } from 'react-konva'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import MemeImage from './tools/MemeImage'
import { useStore } from '@nanostores/react'
import {
  $canvasPosition, $canvasSize, $editorBackground, $editorImages, useSelectImage,
} from '@/stores/editorState'
import { useEffect } from 'react'

export function EditorCanvas ({
  stageRef,
  layerRef,
}: {
  stageRef: React.RefObject<KonvaStage | null>
  layerRef: React.RefObject<KonvaLayer | null>
}) {
  const editorImages = useStore($editorImages)
  const editorBackground = useStore($editorBackground)
  const { selectedId, selectImage, deselectImage } = useSelectImage()
  const canvasSize = useStore($canvasSize)

  const handleMoveToTop = (id: string) => {
    const imageIndex = editorImages.findIndex(img => img.id === id)
    if (imageIndex !== editorImages.length - 1) {
      const newImages = editorImages.filter(img => img.id !== id)
      newImages.push(editorImages[imageIndex])
      $editorImages.set(newImages)
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
      width={canvasSize.width}
      height={canvasSize.height}
      ref={stageRef}
      onClick={deselectImage}
      style={{
        width: `${canvasSize.width}px`,
        height: `${canvasSize.height}px`,
      }}
      className='border border-gray-500 rounded-md flex p-2 items-center justify-center box-content'
    >
      <Layer ref={layerRef}>
        <Rect
          width={canvasSize.width}
          height={canvasSize.height}
          fill={editorBackground}
        />
        {
          editorImages.map(image => (
            <MemeImage
              key={image.id}
              image={image}
              isSelected={image.id === selectedId}
              onSelect={selectImage}
              onDelete={id => $editorImages.set(editorImages.filter(image => image.id !== id))}
              moveToTop={handleMoveToTop}
            />
          ))
        }
      </Layer>
    </Stage>
  )
}
