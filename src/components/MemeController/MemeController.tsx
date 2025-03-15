import { Button } from '../ui/button'
import GiphyList from '../Giphy/GiphyList'
import BackgroundController from './BackgroundController'
import ImageUploadController from './ImageUploadController'
import SaveController from './SaveController'
import ResetController from './ResetController'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import { useRef } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

const DEFAULT_SHEET_HEIGHT = window.innerHeight * 0.4

export default function MemeController ({ stageRef, layerRef, studioRefHeight }: {
  stageRef: React.RefObject<KonvaStage | null>
  layerRef: React.RefObject<KonvaLayer | null>
  studioRefHeight: number
}) {
  const controllers = useRef<HTMLDivElement>(null)

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

  const sheetHeight = Math.max(window.innerHeight - studioRefHeight - 10, DEFAULT_SHEET_HEIGHT)

  return (
    <div ref={controllers}>
      <Drawer modal={false} onOpenChange={scrollToCanvas}>
        <DrawerTrigger>
          <Button>GIPHY</Button>
        </DrawerTrigger>
        <DrawerContent style={{ height: `${sheetHeight}px` }}>
          <DrawerHeader>
            <DrawerTitle>GIPHY</DrawerTitle>
          </DrawerHeader>
          <GiphyList height={sheetHeight} />
        </DrawerContent>
      </Drawer>

      <Drawer onOpenChange={scrollToCanvas}>
        <DrawerTrigger>
          <Button>배경색</Button>
        </DrawerTrigger>
        <DrawerContent style={{ height: `${sheetHeight}px` }}>
          <DrawerHeader>
            <DrawerTitle>배경색</DrawerTitle>
          </DrawerHeader>
          <BackgroundController />
        </DrawerContent>
      </Drawer>

      <Drawer onOpenChange={scrollToCanvas}>
        <DrawerTrigger>
          <Button>이미지 업로드</Button>
        </DrawerTrigger>
        <DrawerContent style={{ height: `${sheetHeight}px` }}>
          <DrawerHeader>
            <DrawerTitle>이미지</DrawerTitle>
          </DrawerHeader>
          <ImageUploadController />
        </DrawerContent>
      </Drawer>

      <SaveController stageRef={stageRef} layerRef={layerRef} />

      <ResetController />
    </div>
  )
}
