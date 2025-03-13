import { useRef } from 'react'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import { EditorCanvas } from './EditorCanvas'
import {
  Sheet, SheetContent, SheetDescription, SheetTrigger,
} from '../ui/sheet'
import { useStore } from '@nanostores/react'
import { $canvasClientSize } from '@/stores/editorState'
import GiphySearch from '../Giphy/GiphySearch'
import BackgroundController from '../Controller/BackgroundController'
import ImageUploadController from '../Controller/ImageUploadController'
import { Button } from '../ui/button'
import SaveController from '../Controller/SaveController'
import { DialogTitle } from '@radix-ui/react-dialog'
import ResetController from '../Controller/ResetController'

export default function Editor () {
  const stageRef = useRef<KonvaStage>(null)
  const layerRef = useRef<KonvaLayer>(null)
  const canvasClientSize = useStore($canvasClientSize)

  const sheetHeight = Math.max(window.innerHeight - canvasClientSize.height, window.innerHeight * 0.4)

  const scrollCanvasTop = (open: boolean) => {
    if (open) {
      const container = stageRef.current?.container()
      if (!container) return

      // 부드러운 스크롤 효과로 캔버스 상단으로 이동
      container.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <>
      <EditorCanvas stageRef={stageRef} layerRef={layerRef} />

      <Sheet onOpenChange={scrollCanvasTop}>
        <SheetTrigger>
          <Button>GIPHY</Button>
        </SheetTrigger>
        <SheetContent side='bottom' style={{ height: `${sheetHeight}px` }}>
          <DialogTitle>GIPHY</DialogTitle>
          <SheetDescription>
            <GiphySearch />
          </SheetDescription>
        </SheetContent>
      </Sheet>

      <Sheet onOpenChange={scrollCanvasTop}>
        <SheetTrigger>
          <Button>배경색</Button>
        </SheetTrigger>
        <SheetContent side='bottom' style={{ height: `${sheetHeight}px` }}>
          <DialogTitle>배경색</DialogTitle>
          <SheetDescription>
            <BackgroundController />
          </SheetDescription>
        </SheetContent>
      </Sheet>

      <Sheet onOpenChange={scrollCanvasTop}>
        <SheetTrigger>
          <Button>이미지 업로드</Button>
        </SheetTrigger>
        <SheetContent side='bottom' style={{ height: `${sheetHeight}px` }}>
          <DialogTitle>이미지</DialogTitle>
          <SheetDescription>
            <ImageUploadController />
          </SheetDescription>
        </SheetContent>
      </Sheet>

      <SaveController stageRef={stageRef} layerRef={layerRef} />

      <ResetController />
    </>
  )
}
