import { useState, useRef } from 'react'
import { Stage, Layer } from 'react-konva'
import type { EditorImage } from './types/Editor'
import ImageUploader from './tools/ImageUploader'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import { downloadGif, downloadPng } from './utils/download'
import MemeImage from './tools/MemeImage'
import useSelectImage from './hooks/useSelectImage'

export default function Editor () {
  const [images, setImages] = useState<EditorImage[]>([])
  const stageRef = useRef<KonvaStage>(null)
  const layerRef = useRef<KonvaLayer>(null)
  const { selectedId, selectImage, deselectImage } = useSelectImage()

  const size = Math.min(window.innerWidth - 20, 500)

  return (
    <div style={{ padding: 10 }}>
      <div style={{ border: '1px solid black', display: 'inline-block' }}>
        <Stage
          width={size}
          height={size}
          ref={stageRef}
          onClick={deselectImage}
        >
          <Layer ref={layerRef}>
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
        <button onClick={() => {
          deselectImage()
          const hasGif = images.some(({ type }) => type === 'gif')
          if (hasGif) downloadGif(layerRef.current)
          else downloadPng(stageRef.current)
        }}
        >밈 저장하기
        </button>
      </div>
    </div>
  )
}
