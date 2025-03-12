import { Stage, Layer, Rect } from 'react-konva'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import MemeImage from './tools/MemeImage'
import { useStore } from '@nanostores/react'
import { $editorBackground, $editorImages, useSelectImage } from '@/stores/editorState'
import { editorSize } from '@/constants/editor'

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
      width={editorSize}
      height={editorSize}
      ref={stageRef}
      onClick={deselectImage}
      style={{
        width: `${editorSize}px`,
        height: `${editorSize}px`,
      }}
      className='border border-gray-500 rounded-lg flex p-2 items-center justify-center box-content'
    >
      <Layer ref={layerRef}>
        <Rect
          width={editorSize}
          height={editorSize}
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
