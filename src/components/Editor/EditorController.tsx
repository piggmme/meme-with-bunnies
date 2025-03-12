import { $editorBackground, $editorImages, $isDownloading } from '@/stores/editorState'
import { useStore } from '@nanostores/react'
import ImageUploader from './tools/ImageUploader'
import { downloadGif, downloadPng } from './utils/download'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'

export default function EditorController ({
  stageRef,
  layerRef,
  deselectImage,
}: {
  stageRef: React.RefObject<KonvaStage | null>
  layerRef: React.RefObject<KonvaLayer | null>
  deselectImage: () => void
}) {
  const editorImages = useStore($editorImages)
  const isDownloading = useStore($isDownloading)
  const editorBackground = useStore($editorBackground)

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <label>
          배경색:
          <input
            type='color'
            value={editorBackground}
            onChange={e => $editorBackground.set(e.target.value)}
          />
        </label>
      </div>
      <ImageUploader addImage={image => $editorImages.set([...editorImages, image])} />
      <button onClick={async () => {
        deselectImage()
        $isDownloading.set(true)
        const hasGif = editorImages.some(({ type }) => type === 'gif')
        try {
          let shareData: ShareData | null | undefined = null
          if (hasGif) {
            shareData = await downloadGif(layerRef.current)
          } else {
            shareData = await downloadPng(stageRef.current)
          }

          if (shareData && navigator.canShare(shareData)) {
          // navigator.share()는 사용자가 직접 클릭한 이벤트 안에서 실행해야 함
            await navigator.share(shareData)
          }
        } catch (e) {
          console.error('다운로드 중 오류 발생!!:', e)
          alert('다운로드에 실패했습니다. 다시 시도해주세요.')
        } finally {
          $isDownloading.set(false)
        }
      }}
      >밈 저장하기
      </button>
      {isDownloading && <div>다운로드 중...</div>}
    </div>
  )
}
