import { $canvasImages, $isDownloading, useSelectImage } from '@/stores/canvasState'
import { useStore } from '@nanostores/react'
import { downloadGif, downloadPng } from '@/utils/download'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import { Button } from '../ui/button'
import { DownloadIcon } from '@radix-ui/react-icons'

export default function SaveController ({
  stageRef,
  layerRef,
}: {
  stageRef: React.RefObject<KonvaStage | null>
  layerRef: React.RefObject<KonvaLayer | null>
}) {
  const canvasImages = useStore($canvasImages)
  const isDownloading = useStore($isDownloading)
  const { deselectImage } = useSelectImage()

  return (
    <>
      <Button
        variant='ghost'
        className='text-gray-600 felx flex-col items-center text-xs'
        onClick={async () => {
          deselectImage()
          $isDownloading.set(true)
          const hasGif = canvasImages.some(({ type }) => type === 'gif')
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
      >
        <DownloadIcon width={25} height={25} />
        저장하기
      </Button>
      {isDownloading && <div>다운로드 중...</div>}
    </>
  )
}
