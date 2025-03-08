import { useState, useRef } from 'react'
import { Stage, Layer } from 'react-konva'
import type { EditorImage } from './types/Editor'
import ImageUploader from './tools/ImageUploader'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { downloadStage } from './utils/download'
import MemeImage from './tools/MemeImage'
import useSelectImage from './hooks/useSelectImage'

export default function Editor () {
  const [images, setImages] = useState<EditorImage[]>([])
  const stageRef = useRef<KonvaStage>(null)
  const { selectedId, selectImage, deselectImage } = useSelectImage()

  return (
    <div>
      <div style={{ border: '1px solid black', display: 'inline-block' }}>
        <Stage
          width={500}
          height={500}
          ref={stageRef}
          onClick={deselectImage}
        >
          <Layer>
            {
              images.map(image => (
                <MemeImage
                  key={image.id}
                  image={image}
                  isSelected={image.id === selectedId}
                  onSelect={selectImage}
                />
              ))
            }
          </Layer>
        </Stage>
      </div>

      <div>
        <ImageUploader addImage={image => setImages([...images, image])} />
        <button onClick={() => downloadStage(stageRef.current)}>밈 저장하기</button>
      </div>
    </div>
  )
}
