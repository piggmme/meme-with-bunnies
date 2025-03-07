import { useState, useRef } from 'react'
import {
  Stage, Layer, Image, Transformer,
} from 'react-konva'
import type { EditorImage } from './types/Editor'
import ImageUploader from './tools/ImageUploader'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Image as KonvaImage } from 'konva/lib/shapes/Image'
import { downloadStage } from './utils/download'
import useSelectImage from './hooks/useSelectImage'

export default function Editor () {
  const [images, setImages] = useState<EditorImage[]>([])
  const stageRef = useRef<KonvaStage>(null)
  const imageRefs = useRef<Record<string, KonvaImage>>({})

  const {
    selectedImageId,
    setSelectedImageId,
    trRef,
    resetSelectedImage,
  } = useSelectImage(imageRefs, stageRef)

  return (
    <div>
      <div style={{ border: '1px solid black', display: 'inline-block' }}>
        <Stage
          width={500}
          height={500}
          ref={stageRef}
          onClick={resetSelectedImage}
        >
          <Layer>
            {
              images.map(image => (
                <Image
                  key={image.id}
                  image={image.image}
                  width={image.width}
                  height={image.height}
                  draggable
                  onClick={() => setSelectedImageId(image.id)}
                  ref={(el) => {
                    if (el) imageRefs.current[image.id] = el
                  }}
                />
              ))
            }
            {selectedImageId && <Transformer ref={trRef} />}
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
