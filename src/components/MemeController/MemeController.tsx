import {
  Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger,
} from '../ui/sheet'
import { Button } from '../ui/button'
import GiphyList from '../Giphy/GiphyList'
import BackgroundController from './BackgroundController'
import ImageUploadController from './ImageUploadController'
import SaveController from './SaveController'
import ResetController from './ResetController'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import { useStore } from '@nanostores/react'
import { $canvasClientSize } from '@/stores/canvasState'

export default function MemeController ({ stageRef, layerRef }: {
  stageRef: React.RefObject<KonvaStage | null>
  layerRef: React.RefObject<KonvaLayer | null>
}) {
  const canvasClientSize = useStore($canvasClientSize)

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

  const sheetHeight = Math.max(window.innerHeight - canvasClientSize.height, window.innerHeight * 0.4)

  return (
    <section>
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
          <SheetTitle>배경색</SheetTitle>
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
          <SheetTitle>이미지</SheetTitle>
          <SheetDescription>
            <ImageUploadController />
          </SheetDescription>
        </SheetContent>
      </Sheet>

      <SaveController stageRef={stageRef} layerRef={layerRef} />

      <ResetController />

    </section>
  )
}
