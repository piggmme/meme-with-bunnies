import { useRef } from 'react'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import { EditorCanvas } from '../MemeCanvas/MemeCanvas'
import {
  Sheet, SheetContent, SheetDescription, SheetTrigger,
} from '../ui/sheet'
import { useStore } from '@nanostores/react'
import { $canvasClientSize } from '@/stores/canvasState'
import BackgroundController from '../MemeController/BackgroundController'
import ImageUploadController from '../MemeController/ImageUploadController'
import { Button } from '../ui/button'
import SaveController from '../MemeController/SaveController'
import { DialogTitle } from '@radix-ui/react-dialog'
import ResetController from '../MemeController/ResetController'
import GiphyList from '../Giphy/GiphyList'

export default function MemeStudio () {
  const stageRef = useRef<KonvaStage>(null)
  const layerRef = useRef<KonvaLayer>(null)
  const canvasClientSize = useStore($canvasClientSize)

  const sheetHeight = Math.max(window.innerHeight - canvasClientSize.height, window.innerHeight * 0.4)

  const scrollToCanvas = (open: boolean) => {
    if (open) {
      const container = stageRef.current?.container()
      if (!container) return

      container.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  return (
    <>
      <EditorCanvas stageRef={stageRef} layerRef={layerRef} />

      <Sheet onOpenChange={scrollToCanvas}>
        <SheetTrigger>
          <Button>GIPHY</Button>
        </SheetTrigger>
        <SheetContent side='bottom' style={{ height: `${sheetHeight}px` }}>
          <SheetDescription>
            <GiphyList height={sheetHeight} />
          </SheetDescription>
        </SheetContent>
      </Sheet>

      <Sheet onOpenChange={scrollToCanvas}>
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

      <Sheet onOpenChange={scrollToCanvas}>
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
