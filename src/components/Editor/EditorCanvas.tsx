import { Stage, Layer, Rect } from 'react-konva'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import MemeImage from './tools/MemeImage'
import { useStore } from '@nanostores/react'
import { $canvasSize, $editorBackground, $editorImages, useSelectImage } from '@/stores/editorState'

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
