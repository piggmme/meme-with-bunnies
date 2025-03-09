import { useState, useRef } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import ImageUploader from './tools/ImageUploader'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import { downloadGif, downloadPng } from './utils/download'
import MemeImage from './tools/MemeImage'
import useSelectImage from './hooks/useSelectImage'
import { useStore } from '@nanostores/react'
import { $editorImages } from '@/stores/editorState'

export default function Editor () {
  const editorImages = useStore($editorImages)
  const stageRef = useRef<KonvaStage>(null)
  const layerRef = useRef<KonvaLayer>(null)
  const { selectedId, selectImage, deselectImage } = useSelectImage()
  const [isDownloading, setIsDownloading] = useState(false)
  const [bgColor, setBgColor] = useState('#ffffff') // 배경색 상태 추가

  const size = Math.min(window.innerWidth - 20, 500)

  const handleMoveToTop = (id: string) => {
    const imageIndex = editorImages.findIndex(img => img.id === id)
    if (imageIndex !== editorImages.length - 1) {
      const newImages = editorImages.filter(img => img.id !== id)
      newImages.push(editorImages[imageIndex])
      $editorImages.set(newImages)
    }
  }

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
            <Rect
              width={size}
              height={size}
              fill={bgColor}
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
      </div>

      <div>
        <div style={{ marginBottom: 10 }}>
          <label>
            배경색:
            <input
              type='color'
              value={bgColor}
              onChange={e => setBgColor(e.target.value)}
            />
          </label>
        </div>
        <ImageUploader addImage={image => $editorImages.set([...editorImages, image])} />
        <button onClick={async () => {
          deselectImage()
          setIsDownloading(true)
          const hasGif = editorImages.some(({ type }) => type === 'gif')
          if (hasGif) await downloadGif(layerRef.current)
          else downloadPng(stageRef.current)
          setIsDownloading(false)
        }}
        >밈 저장하기
        </button>
        {isDownloading && <div>다운로드 중...</div>}
      </div>
    </div>
  )
}
