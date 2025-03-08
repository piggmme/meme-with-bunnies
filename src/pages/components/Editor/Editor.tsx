import { useState, useRef } from 'react'
import {
  Stage, Layer, Image,
} from 'react-konva'
import type { EditorImage } from './types/Editor'
import ImageUploader from './tools/ImageUploader'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Image as KonvaImage } from 'konva/lib/shapes/Image'
import { downloadStage } from './utils/download'
import ImageTransformer from './tools/ImageTransformer'

export default function Editor () {
  const [images, setImages] = useState<EditorImage[]>([])
  const stageRef = useRef<KonvaStage>(null)
  const imageRefs = useRef<Record<string, KonvaImage>>({})
  const trRef = useRef<any>(null)

  return (
    <div>
      <div style={{ border: '1px solid black', display: 'inline-block' }}>
        <Stage
          width={500}
          height={500}
          ref={stageRef}
          onClick={trRef.current?.resetSelectedImage}
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
                  onClick={() => trRef.current?.setSelectedImageId(image.id)}
                  ref={(el) => {
                    if (el) imageRefs.current[image.id] = el
                  }}
                />
              ))
            }
            <ImageTransformer imageRefs={imageRefs} stageRef={stageRef} ref={trRef} />
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
